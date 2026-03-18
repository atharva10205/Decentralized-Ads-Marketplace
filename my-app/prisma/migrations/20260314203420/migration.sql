/*
  Warnings:

  - You are about to drop the column `calculated` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "calculated";

-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "calculated" BOOLEAN NOT NULL DEFAULT false;
