/*
  Warnings:

  - You are about to drop the column `isTrialUser` on the `image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "image" DROP COLUMN "isTrialUser";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isTrialUser" BOOLEAN NOT NULL DEFAULT true;
