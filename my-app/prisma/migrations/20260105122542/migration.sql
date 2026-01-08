/*
  Warnings:

  - You are about to drop the column `website_id` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `website_id` on the `Impression` table. All the data in the column will be lost.
  - Added the required column `website_url` to the `Click` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website_url` to the `Impression` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_website_id_fkey";

-- DropForeignKey
ALTER TABLE "Impression" DROP CONSTRAINT "Impression_website_id_fkey";

-- DropIndex
DROP INDEX "Click_website_id_created_at_idx";

-- DropIndex
DROP INDEX "Impression_website_id_created_at_idx";

-- AlterTable
ALTER TABLE "Click" DROP COLUMN "website_id",
ADD COLUMN     "website_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Impression" DROP COLUMN "website_id",
ADD COLUMN     "website_url" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Click_website_url_created_at_idx" ON "Click"("website_url", "created_at");

-- CreateIndex
CREATE INDEX "Impression_website_url_created_at_idx" ON "Impression"("website_url", "created_at");

-- AddForeignKey
ALTER TABLE "Impression" ADD CONSTRAINT "Impression_website_url_fkey" FOREIGN KEY ("website_url") REFERENCES "new_website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_website_url_fkey" FOREIGN KEY ("website_url") REFERENCES "new_website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
