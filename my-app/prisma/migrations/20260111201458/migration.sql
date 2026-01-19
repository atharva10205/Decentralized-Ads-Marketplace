/*
  Warnings:

  - You are about to drop the column `Weekly_Cost` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "Weekly_Cost",
ADD COLUMN     "Cost" DECIMAL(18,9);
