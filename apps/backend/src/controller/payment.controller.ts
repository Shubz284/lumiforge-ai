import type { Request, Response } from "express";
import type { AuthedRequest } from "../middlware/requireAuth";
import { ErrorResponse, SuccessResponse } from "../utility/ApiResponse";
import { razorpay } from "../lib/razorpay";
import { prisma } from "../../db";
import z from "zod";
import { findPack } from "../lib/creditPackages";
import {
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "../lib/verifyPaymentSignature";
import { fulfillPayment } from "../service/payment.service";

const checkoutSchema = z.object({ packId: z.string().min(1) });

export const createRazorpayOrder = async (req: Request, res: Response) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json(ErrorResponse(`error: ${parsed.error.flatten().fieldErrors}`));
  }

  const pack = findPack(parsed.data.packId);
  if (!pack) {
    res.status(404).json(ErrorResponse("Unknown pack."));
    return;
  }

  const totalCredits = pack.baseCredits + pack.bonusCredits;

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: pack.amountPaise,
      currency: "INR",
      receipt: crypto.randomUUID().slice(0, 30),
      notes: {
        userId,
        packId: pack.id,
        credits: totalCredits,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId,
        status: "CREATED",
        packId: pack.id,
        amount: pack.amountPaise,
        currency: "INR",
        credits: totalCredits,
        razorpayOrderId: razorpayOrder.id,
      },
    });

    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
      packName: pack.name,
      credits: totalCredits,
    };

    console.log("order create succesfully")

    res.status(201).json(SuccessResponse(data));
  } catch (error) {
    console.error("Order creation failed:", error);
    return res.status(502).json(ErrorResponse("Failed to create Razorpay order"));
  }
};

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const verifyPayment = async (req: Request, res: Response) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = verifyPaymentSchema.safeParse(req.body);
  
    console.log("RAW BODY:", JSON.stringify(req.body)); // add this
    console.log("PARSED SUCCESS:", parsed.success); // add this

    if (!parsed.success) {
      console.log("PARSE ERROR:", parsed.error.flatten()); // add this
      return res.status(400).json(ErrorResponse("Invalid request body"));
    }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =  parsed.data;

  const isValid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    await prisma.payment.updateMany({
      where: {
        razorpayOrderId: razorpay_order_id,
        status: "CREATED",
      },
      data: {
        status: "FAILED",
      },
    });
    res
      .status(400)
      .json(ErrorResponse("Payment signature verification failed."));
    return;
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: {
        razorpayOrderId: razorpay_order_id,
      },
      select: { id: true, userId: true, credits: true, packId: true },
    });

    if (!payment || payment.userId !== userId) {
      return res.status(404).json(ErrorResponse("Payment not found"));
    }

    const result = await fulfillPayment(
      payment,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!result) {
      return res.status(409).json(ErrorResponse("Payment already processed"));
    }

    const data = {
      creditsAdded: result.creditsAdded,
      balance: result.balance,
    };

    return res
      .status(200)
      .json(SuccessResponse(data));
  } catch (error) {
    console.error(
      "verifyPayment failed:",
      error instanceof Error ? error.message : error,
    );
    return res.status(500).json(ErrorResponse("Something went wrong"));
  }
};

export async function creditsWebhookHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const signature = req.header("x-razorpay-signature") ?? "";
  const rawBody = req.body instanceof Buffer ? req.body.toString("utf8") : "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error(
      "Webhook JSON parse failed:",
      err instanceof Error ? err.message : err,
    );
    res.status(200).json(SuccessResponse({ status: "ignored" }));
    return;
  }

  const entity = event.payload?.payment?.entity;

  if (event.event !== "payment.captured" || !entity?.order_id || !entity.id) {
    res.status(200).json(SuccessResponse({ status: "ok" })); // nothing to do, acknowledge anyway
    return;
  }

  try {
    const paymentRecord = await prisma.payment.findUnique({
      where: { razorpayOrderId: entity.order_id },
      select: { id: true, userId: true, credits: true, packId: true },
    });

    if (!paymentRecord) {
      console.error("No matching payment for order", entity.order_id);
      res.status(200).json(SuccessResponse({ status: "ok" })); // not retryable, don't error
      return;
    }

    await fulfillPayment(paymentRecord, entity.id, null); // null result = already fulfilled, fine either way

    res.status(200).json(SuccessResponse({ status: "ok" }));
  } catch (err) {
    console.error(
      "fulfillPayment failed:",
      err instanceof Error ? err.message : err,
    );
    res.status(500).json(ErrorResponse("fulfillment failed")); // retryable
  }
}

export const transactionHistory = async(req:Request, res:Response) => {
  const userId = (req as AuthedRequest) .userId;

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        status: true,
        packId: true,
        amount: true,
        credits: true,
        createdAt: true,
      },
    })

    if(!payments) return res.status(402).json(ErrorResponse("Failed to fetch transaction history"))
    res.status(200).json(SuccessResponse(payments))
  } catch (error) {
    console.log(error)
    return res.status(500).json(ErrorResponse("SERVER ERROR"))
  }
}