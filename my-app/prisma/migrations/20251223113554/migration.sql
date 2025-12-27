-- CreateTable
CREATE TABLE "ad" (
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

    CONSTRAINT "ad_pkey" PRIMARY KEY ("id")
);
