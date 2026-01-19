/*
  Warnings:

  - You are about to drop the column `Weekly_Clicks` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "Weekly_Clicks",
ADD COLUMN     "Clicks" INTEGER;

-- AlterTable
ALTER TABLE "new_website" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';
