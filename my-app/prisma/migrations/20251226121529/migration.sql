/*
  Warnings:

  - You are about to alter the column `cost_per_click` on the `Ad` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(18,9)`.
  - You are about to alter the column `Weekly_Cost` on the `Ad` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(18,9)`.

*/
-- AlterTable
ALTER TABLE "Ad" ALTER COLUMN "cost_per_click" SET DATA TYPE DECIMAL(18,9),
ALTER COLUMN "Weekly_Cost" SET DATA TYPE DECIMAL(18,9);
