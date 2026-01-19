/*
  Warnings:

  - You are about to drop the column `created_at` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `impression_id` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `user_ip` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `website_url` on the `Click` table. All the data in the column will be lost.
  - Added the required column `publisher_id` to the `Click` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_ad_id_fkey";

-- DropIndex
DROP INDEX "Click_ad_id_created_at_idx";

-- DropIndex
DROP INDEX "Click_created_at_idx";

-- DropIndex
DROP INDEX "Click_website_url_created_at_idx";

-- AlterTable
ALTER TABLE "Click" DROP COLUMN "created_at",
DROP COLUMN "impression_id",
DROP COLUMN "user_agent",
DROP COLUMN "user_ip",
DROP COLUMN "website_url",
ADD COLUMN     "publisher_id" TEXT NOT NULL;
