-- CreateTable
CREATE TABLE "Impression" (
    "id" TEXT NOT NULL,
    "ad_id" TEXT NOT NULL,
    "publisher_id" TEXT NOT NULL,
    "impression" INTEGER NOT NULL,

    CONSTRAINT "Impression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Impression_ad_id_publisher_id_key" ON "Impression"("ad_id", "publisher_id");
