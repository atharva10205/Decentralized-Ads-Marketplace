/*
  Warnings:

  - A unique constraint covering the columns `[ad_id,publisher_id,publisher_url]` on the table `Impression` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Impression_ad_id_publisher_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Impression_ad_id_publisher_id_publisher_url_key" ON "Impression"("ad_id", "publisher_id", "publisher_url");
