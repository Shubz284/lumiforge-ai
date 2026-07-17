-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "resolution" TEXT,
    "aspectRatio" TEXT,
    "imageKey" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "creditCost" INTEGER NOT NULL,
    "status" "ImageStatus" NOT NULL DEFAULT 'PENDING',
    "providerJobId" TEXT,
    "cost" DOUBLE PRECISION,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_userId_idx" ON "image"("userId");

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
