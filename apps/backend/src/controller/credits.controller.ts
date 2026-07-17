import type { Request, Response } from "express";
import type { AuthedRequest } from "../middlware/requireAuth";
import { prisma } from "../../db";
import { ErrorResponse, SuccessResponse } from "../utility/ApiResponse";
import { CREDIT_PACKS} from "../lib/creditPackages";
import { env } from "../schema/schema";

export async function currentCredits(req:Request, res:Response){
    const userId = (req as AuthedRequest).userId
    try {
        const [user, transactions] = await Promise.all([
          prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
          }),
          prisma.creditTransaction.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            take: 50,
            select: {
              id: true,
              type: true,
              amount: true,
              balanceAfter: true,
              description: true,
              referenceType: true,
              referenceId: true,
              createdAt: true,
            },
          }),
        ]);
        const data = { balance: user?.credits ?? 0, transactions };
        res.status(200).json(SuccessResponse(data));
    } catch (error) {
        console.error("Failed to fetch credits/transactions:", error);
        res.status(500).json(ErrorResponse(`error: "Failed to load credits`));
    }
}

export async function pricingDetails(req:Request, res:Response){
    res.status(200).json(
      SuccessResponse({
        currency: "INR",
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        packs: CREDIT_PACKS.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          priceInr: p.priceInr,
          baseCredits: p.baseCredits,
          bonusCredits: p.bonusCredits,
        })),
        creditCostPerGeneration: env.CREDITS_PER_IMAGE,
      }),
    )
}