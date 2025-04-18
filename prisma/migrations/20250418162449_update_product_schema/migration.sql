/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `analyticsCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
DROP COLUMN "isActive",
DROP COLUMN "price",
ADD COLUMN     "additionalRequirementIds" TEXT[],
ADD COLUMN     "allowComment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "analyticsCode" TEXT NOT NULL,
ADD COLUMN     "autoDeliverKey" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "autoSyncQuantityWithKey" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "customBodyCode" TEXT,
ADD COLUMN     "customHeadCode" TEXT,
ADD COLUMN     "expiryDays" INTEGER,
ADD COLUMN     "faq" TEXT,
ADD COLUMN     "gameCode" TEXT NOT NULL,
ADD COLUMN     "gameKeyText" TEXT,
ADD COLUMN     "guideText" TEXT,
ADD COLUMN     "guideUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "importPrice" INTEGER NOT NULL,
ADD COLUMN     "importSource" TEXT,
ADD COLUMN     "lowStockWarning" INTEGER,
ADD COLUMN     "mainKeyword" TEXT,
ADD COLUMN     "maxPerOrder" INTEGER,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "minPerOrder" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "originalPrice" INTEGER NOT NULL,
ADD COLUMN     "popupContent" TEXT,
ADD COLUMN     "popupEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "popupTitle" TEXT,
ADD COLUMN     "promotionEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "promotionEndDate" TIMESTAMP(3),
ADD COLUMN     "promotionPrice" INTEGER,
ADD COLUMN     "promotionQuantity" INTEGER,
ADD COLUMN     "promotionStartDate" TIMESTAMP(3),
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requirePhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondaryKeywords" TEXT[],
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "showMoreDescription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "warrantyPolicy" TEXT;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RelatedProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "_RelatedProducts_B_index" ON "_RelatedProducts"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedProducts" ADD CONSTRAINT "_RelatedProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedProducts" ADD CONSTRAINT "_RelatedProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
