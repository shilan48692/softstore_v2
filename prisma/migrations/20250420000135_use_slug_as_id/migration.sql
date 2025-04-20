/*
  Warnings:

  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameCode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_slug_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "Product_gameCode_key" ON "Product"("gameCode");
