/*
  Warnings:

  - The values [REVOKED] on the enum `KeyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KeyStatus_new" AS ENUM ('AVAILABLE', 'SOLD', 'USED', 'EXPORTED');
ALTER TABLE "Key" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Key" ALTER COLUMN "status" TYPE "KeyStatus_new" USING ("status"::text::"KeyStatus_new");
ALTER TYPE "KeyStatus" RENAME TO "KeyStatus_old";
ALTER TYPE "KeyStatus_new" RENAME TO "KeyStatus";
DROP TYPE "KeyStatus_old";
ALTER TABLE "Key" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
