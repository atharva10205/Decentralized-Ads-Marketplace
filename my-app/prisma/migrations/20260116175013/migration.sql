/*
  Warnings:

  - Added the required column `publisher_url` to the `Click` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher_url` to the `Impression` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "publisher_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Impression" ADD COLUMN     "publisher_url" TEXT NOT NULL;
