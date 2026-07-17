import { prisma } from "../../db"

interface PaymentForFulfilment {
   id: string;
   userId: string;
   credits: number;
   packId:string
}

export async function fulfillPayment(
  payment: PaymentForFulfilment,
  razorpayPaymentId: string,
  razorpaySignature: string | null,
) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.updateMany({
      where: {
        id: payment.id,
        status: "CREATED",
      },
      data: {
        status: "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    if (updated.count === 0) {
      return null;
    }

    const user = await tx.user.update({
      where: {
        id: payment.userId,
      },
      data: {
        credits: {
          increment: payment.credits,
        },
        isTrialUser: false, // ← added: paying customer, no more trial restrictions
      },
      select: {
        credits: true,
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId: payment.userId,
        amount: payment.credits,
        balanceAfter: user.credits,
        type: "PURCHASE",
        referenceType: "payment",
        referenceId: payment.id,
        description: `${payment.packId} pack`,
      },
    });

    return {
      creditsAdded: payment.credits,
      balance: user.credits,
    };
  });
}
