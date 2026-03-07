-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EarningsRecord" (
    "id" TEXT NOT NULL,
    "publisher_wallet" TEXT NOT NULL,
    "ad_id" TEXT NOT NULL,
    "claimable_amount" INTEGER NOT NULL,
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "tx_signature" TEXT,
    "settled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningsRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EarningsRecord_publisher_wallet_ad_id_key" ON "EarningsRecord"("publisher_wallet", "ad_id");
