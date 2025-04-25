/*
  Warnings:

  - The values [USED] on the enum `KeyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KeyStatus_new" AS ENUM ('AVAILABLE', 'SOLD', 'EXPORTED');
ALTER TABLE "Key" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Key" ALTER COLUMN "status" TYPE "KeyStatus_new" USING ("status"::text::"KeyStatus_new");
ALTER TYPE "KeyStatus" RENAME TO "KeyStatus_old";
ALTER TYPE "KeyStatus_new" RENAME TO "KeyStatus";
DROP TYPE "KeyStatus_old";
ALTER TABLE "Key" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "importSourceId" TEXT;

-- CreateTable
CREATE TABLE "ImportSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportSource_name_key" ON "ImportSource"("name");

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_importSourceId_fkey" FOREIGN KEY ("importSourceId") REFERENCES "ImportSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
