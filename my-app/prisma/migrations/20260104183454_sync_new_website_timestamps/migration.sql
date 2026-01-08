/*
  Warnings:

  - A unique constraint covering the columns `[website_url]` on the table `new_website` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "new_website_website_name_key";

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "new_website" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Impression" (
    "id" TEXT NOT NULL,
    "ad_id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "match_score" DECIMAL(5,2),
    "user_ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Impression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Click" (
    "id" TEXT NOT NULL,
    "ad_id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "impression_id" TEXT,
    "user_ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Impression_ad_id_created_at_idx" ON "Impression"("ad_id", "created_at");

-- CreateIndex
CREATE INDEX "Impression_website_id_created_at_idx" ON "Impression"("website_id", "created_at");

-- CreateIndex
CREATE INDEX "Impression_created_at_idx" ON "Impression"("created_at");

-- CreateIndex
CREATE INDEX "Click_ad_id_created_at_idx" ON "Click"("ad_id", "created_at");

-- CreateIndex
CREATE INDEX "Click_website_id_created_at_idx" ON "Click"("website_id", "created_at");

-- CreateIndex
CREATE INDEX "Click_created_at_idx" ON "Click"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "new_website_website_url_key" ON "new_website"("website_url");

-- AddForeignKey
ALTER TABLE "Impression" ADD CONSTRAINT "Impression_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impression" ADD CONSTRAINT "Impression_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "new_website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "new_website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
