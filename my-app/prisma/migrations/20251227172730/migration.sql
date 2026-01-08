-- CreateTable
CREATE TABLE "new_website" (
    "id" TEXT NOT NULL,
    "website_name" TEXT,
    "website_url" TEXT,
    "Tags" TEXT[],
    "keywords" TEXT[],
    "wallet_address" TEXT,

    CONSTRAINT "new_website_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "new_website_website_name_key" ON "new_website"("website_name");
