/*
  Warnings:

  - You are about to drop the column `user_id` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `user_email` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "user_id",
ADD COLUMN     "user_email" TEXT NOT NULL;
