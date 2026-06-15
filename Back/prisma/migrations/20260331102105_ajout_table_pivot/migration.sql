/*
  Warnings:

  - You are about to drop the column `category` on the `Resources` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('FOOD', 'CLOTHES', 'TOOLS', 'TRANSPORT', 'HOUSING', 'SERVICES', 'EDUCATION', 'HEALTH', 'SOCIAL_SUPPORT', 'EVENTS', 'COMMUNITY', 'VOLUNTEERING', 'DONATION', 'JOB_HELP', 'CHILDCARE', 'ELDERLY_HELP', 'PETS', 'SPORT', 'CULTURE', 'OTHER');

-- AlterTable
ALTER TABLE "Resources" DROP COLUMN "category",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "description" TEXT;

-- DropEnum
DROP TYPE "ResourceCategory";

-- CreateTable
CREATE TABLE "ResourceCategory" (
    "id" SERIAL NOT NULL,
    "category" "CategoryEnum" NOT NULL,
    "resource_id" INTEGER NOT NULL,

    CONSTRAINT "ResourceCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceCategory" ADD CONSTRAINT "ResourceCategory_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resources"("ressource_id") ON DELETE RESTRICT ON UPDATE CASCADE;
