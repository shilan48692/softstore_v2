/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('DISABLED', 'EMAIL', 'TWO_FACTOR');

-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('AVAILABLE', 'USED', 'REVOKED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'FAILED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "role",
ADD COLUMN     "chatLink" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "loginIPs" TEXT[],
ADD COLUMN     "note" TEXT,
ADD COLUMN     "otpLogin" "OtpType" NOT NULL DEFAULT 'DISABLED',
ADD COLUMN     "otpPayment" "OtpType" NOT NULL DEFAULT 'DISABLED',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "receiveNewsletter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalPaid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalProfit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Key" (
    "id" TEXT NOT NULL,
    "activationCode" TEXT NOT NULL,
    "note" TEXT,
    "cost" INTEGER NOT NULL DEFAULT 0,
    "status" "KeyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "productId" TEXT NOT NULL,
    "orderId" TEXT,
    "userId" TEXT,
    "userEmail" TEXT,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "totalSellPrice" INTEGER NOT NULL,
    "totalCostPrice" INTEGER NOT NULL,
    "totalProfit" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpersonationLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "ImpersonationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpersonationLog" ADD CONSTRAINT "ImpersonationLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpersonationLog" ADD CONSTRAINT "ImpersonationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
