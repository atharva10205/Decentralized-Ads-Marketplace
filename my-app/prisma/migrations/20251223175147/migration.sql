/*
  Warnings:

  - You are about to drop the column `Niches` on the `Ad` table. All the data in the column will be lost.
  - The `keywords` column on the `Ad` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "Niches",
ADD COLUMN     "Tags" TEXT[],
DROP COLUMN "keywords",
ADD COLUMN     "keywords" TEXT[];
