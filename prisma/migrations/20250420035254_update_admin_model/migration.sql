/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `picture` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Admin` table. All the data in the column will be lost.
  - The `id` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "picture",
DROP COLUMN "role",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
