/*
  Warnings:

  - You are about to drop the column `created_at` on the `Impression` table. All the data in the column will be lost.
  - You are about to drop the column `match_score` on the `Impression` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `Impression` table. All the data in the column will be lost.
  - You are about to drop the column `user_ip` on the `Impression` table. All the data in the column will be lost.
  - You are about to drop the column `website_url` on the `Impression` table. All the data in the column will be lost.
  - You are about to drop the `new_website` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publisher_id` to the `Impression` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_website_url_fkey";

-- DropForeignKey
ALTER TABLE "Impression" DROP CONSTRAINT "Impression_ad_id_fkey";

-- DropForeignKey
ALTER TABLE "Impression" DROP CONSTRAINT "Impression_website_url_fkey";

-- DropIndex
DROP INDEX "Impression_ad_id_created_at_idx";

-- DropIndex
DROP INDEX "Impression_created_at_idx";

-- DropIndex
DROP INDEX "Impression_website_url_created_at_idx";

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "impression" INTEGER;

-- AlterTable
ALTER TABLE "Impression" DROP COLUMN "created_at",
DROP COLUMN "match_score",
DROP COLUMN "user_agent",
DROP COLUMN "user_ip",
DROP COLUMN "website_url",
ADD COLUMN     "publisher_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "new_website";

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "website_name" TEXT,
    "website_url" TEXT,
    "Tags" TEXT[],
    "keywords" TEXT[],
    "wallet_address" TEXT,
    "status" TEXT DEFAULT 'INACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_website_url_key" ON "Publisher"("website_url");
