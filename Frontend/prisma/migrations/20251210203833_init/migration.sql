/*
  Warnings:

  - A unique constraint covering the columns `[ad_id]` on the table `AD_1` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AD_1_ad_id_key" ON "AD_1"("ad_id");
