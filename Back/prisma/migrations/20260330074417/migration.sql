/*
  Warnings:

  - You are about to drop the column `category` on the `Resources` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resources" DROP COLUMN "category",
DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refresh_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "refresh_token_hash" TEXT,
ALTER COLUMN "address_complement" DROP NOT NULL;
