/*
  Warnings:

  - You are about to drop the column `creditCost` on the `image` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CreditTxnType" AS ENUM ('PURCHASE', 'SPEND', 'REFUND', 'BONUS', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "image" DROP COLUMN "creditCost";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "credit_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CreditTxnType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_transaction_userId_idx" ON "credit_transaction"("userId");

-- CreateIndex
CREATE INDEX "credit_transaction_referenceType_referenceId_idx" ON "credit_transaction"("referenceType", "referenceId");

-- AddForeignKey
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
