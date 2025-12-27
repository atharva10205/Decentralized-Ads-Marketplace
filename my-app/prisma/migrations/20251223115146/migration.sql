/*
  Warnings:

  - You are about to drop the `ad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ad";

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "destination_url" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Niches" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "cost_per_click" INTEGER NOT NULL,
    "Weekly_Clicks" INTEGER NOT NULL,
    "Weekly_Cost" INTEGER NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);
