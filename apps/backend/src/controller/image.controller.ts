import { generateImage } from "../lib/openrouter";
import fs from "fs/promises";
import path from "path";
import { extFromMime } from "../utility/extMime";
import { prisma } from "../../db";
import { requireAuth, type AuthedRequest } from "../middlware/requireAuth";
import type { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../utility/ApiResponse";
import { r2, uploadImageToR2 } from "../lib/r2";
import { env, imageGenerationSchema, normalizeResolution } from "../schema/schema";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



// // for testing
// const TRIAL_ALLOWED_MODEL = "sourceful/riverflow-v2.5-fast";

export async function createImage(req: Request, res: Response) {
  const parsedData = imageGenerationSchema.safeParse(req.body);
  const userId = (req as AuthedRequest).userId;

  if (!parsedData.success) {
    return res.status(400).json({
      error: "INVALID_REQUEST",
      details: parsedData.error.flatten(),
    });
  }

  const { prompt, model, aspectRatio, resolution } = parsedData.data;

  // NEW: fetch trial status before doing anything else
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { isTrialUser: true },
  });

  // NEW: block disallowed models during trial, before any credit deduction happens
  if (user.isTrialUser && model !== env.FREE_TRIAL_MODEL) {
    return res.status(403).json({
      error: "TRIAL_MODEL_RESTRICTED",
      details: `Free trial is limited to ${env.FREE_TRIAL_MODEL}. Purchase credits to unlock all models.`,
    });
  }

  let spendTxnId: string;
  try {
    // 1. Atomic deduct — check-and-decrement in one query
    const deducted = await prisma.user.updateMany({
      where: { id: userId, credits: { gte: env.CREDITS_PER_IMAGE } },
      data: { credits: { decrement: env.CREDITS_PER_IMAGE } },
    });

    if (deducted.count === 0) {
      return res.status(402).json({ error: "Insufficient credits" });
    }

    // 2. Log the spend
    const userAfterDeduct = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { credits: true },
    });

    const spendTxn = await prisma.creditTransaction.create({
      data: {
        userId,
        type: "SPEND",
        amount: -env.CREDITS_PER_IMAGE,
        balanceAfter: userAfterDeduct.credits,
        description: "Image generation",
      },
    });
    spendTxnId = spendTxn.id;

    // 3. Actual generation
    const generated = await generateImage({
      prompt,
      model,
      resolution,
      aspectRatio,
    });
    const ext = extFromMime(generated.contentType);
    const imgKey = `generated/${crypto.randomUUID()}.${ext}`;

    const { key, url } = await uploadImageToR2({
      buffer: generated.buffer,
      contentType: generated.contentType,
      objectKey: imgKey,
    });

    const record = await prisma.image.create({
      data: {
        userId,
        prompt,
        model,
        resolution: normalizeResolution(resolution) as string | undefined,
        aspectRatio,
        imageKey: key,
        storageUrl: url,
        mediaType: generated.contentType,
        cost: generated.cost ?? null,
        creditCost: env.CREDITS_PER_IMAGE,
        status: "COMPLETED",
      },
    });

    // 4. Link the spend transaction to the completed image
    await prisma.creditTransaction.update({
      where: { id: spendTxnId },
      data: { referenceType: "image", referenceId: record.id },
    });

    // NEW: trial is now used — flip the flag so future requests aren't restricted
    // (only matters if they were a trial user; harmless no-op otherwise)
    if (user.isTrialUser) {
      await prisma.user.update({
        where: { id: userId },
        data: { isTrialUser: false },
      });
    }

    const data = {
      id: record.id,
      prompt: record.prompt,
      storageUrl: record.storageUrl,
    };

    return res.status(201).json(SuccessResponse(data));
  } catch (err) {
    if (spendTxnId!) {
      const userAfterRefund = await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: env.CREDITS_PER_IMAGE } },
      });

      await prisma.creditTransaction.create({
        data: {
          userId,
          type: "REFUND",
          amount: env.CREDITS_PER_IMAGE,
          balanceAfter: userAfterRefund.credits,
          description: "Refund: generation failed",
          referenceType: "credit_transaction",
          referenceId: spendTxnId,
        },
      });
    }

    return res
      .status(502)
      .json({ error: "Generation failed, credits refunded" });
  }
}

export const getMyImages = async (req: Request, res: Response) => {
  const userId = (req as AuthedRequest).userId;

  try {
    const images = await prisma.image.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(SuccessResponse(images));
  } catch (error) {
    return res
      .status(500)
      .json(
        ErrorResponse(
          error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",
        ),
      );
  }
};

export const getMyImage = async(req:Request, res:Response) => {
  const userId = (req as AuthedRequest).userId;

  const imageId = req.params.imageId as string;
  if(!imageId) return res.status(400).json(ErrorResponse("Image ID is required"));
  try {
    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        userId: userId,
      },
      select: {
        id: true,
        storageUrl: true,
        prompt: true,
        model: true,
        createdAt: true,
        status: true,
      },
    });

    if(!image) return res.status(404).json(ErrorResponse("Image not found"));
    return res.status(200).json(SuccessResponse(image));
  } catch (error) {
    return res.status(500).json(ErrorResponse( 
      error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",),
      );
  }
};

export const deleteImage = async(req:Request, res:Response) => {
  const userId = (req as AuthedRequest).userId;
  const imageId = req.params.imageId as string
  if(!imageId) return res.status(400).json(ErrorResponse("Image ID is required"));
  try {
    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        userId,
      },
    });

    if (!image) {
      return res.status(404).json(ErrorResponse("Image not found"));
    }

    await prisma.image.delete({
      where: {
        id: image.id,
      },
    });

    return res.status(200).json(SuccessResponse("Image deleted successfully"));
  } catch (error) {
    return res.status(500).json(ErrorResponse(
      error instanceof Error ? error.message: "Internal Sever Error"
    ))
  }
}

export const downLoadImage = async(req:Request, res:Response) => {
  const userId = (req as AuthedRequest).userId;
  const imageId = req.params.imageId as string;
  if (!imageId)
    return res.status(400).json(ErrorResponse("Image ID is required"));
  try {
    const image = await prisma.image.findFirst({
      where:{
        id:imageId,
        userId:userId
      }
    })

    if(!image) return res.status(404).json({ error: "Image not found" });

    const object = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: image.imageKey,
      }),
    );

    if (!object.Body) {
      return res.status(404).json({ error: "Image data not found" });
    }

    const buffer = Buffer.from(await object.Body.transformToByteArray());

    res.setHeader("Content-Type", image.mediaType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${image.id}.${image.mediaType.split("/")[1]}"`,
    );

    res.setHeader("Content-Length", buffer.length.toString());

    res.send(buffer);
  } catch (error) {
    return res.status(500).json(ErrorResponse(
      error instanceof Error ? error.message : "Internal Server Error"
    ))
  }
}
