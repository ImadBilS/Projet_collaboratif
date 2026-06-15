/*
  Warnings:

  - You are about to drop the `ResourceCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityMessage" DROP CONSTRAINT "ActivityMessage_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityParticipant" DROP CONSTRAINT "ActivityParticipant_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "ResourceCategory" DROP CONSTRAINT "ResourceCategory_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResourceProgress" DROP CONSTRAINT "UserResourceProgress_ressource_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResourceProgress" DROP CONSTRAINT "UserResourceProgress_user_id_fkey";

-- AlterTable
ALTER TABLE "Resources" ADD COLUMN     "category" "CategoryEnum"[],
ADD COLUMN     "content" TEXT;

-- DropTable
DROP TABLE "ResourceCategory";

-- AddForeignKey
ALTER TABLE "UserResourceProgress" ADD CONSTRAINT "UserResourceProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResourceProgress" ADD CONSTRAINT "UserResourceProgress_ressource_id_fkey" FOREIGN KEY ("ressource_id") REFERENCES "Resources"("ressource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityParticipant" ADD CONSTRAINT "ActivityParticipant_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("activity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityMessage" ADD CONSTRAINT "ActivityMessage_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("activity_id") ON DELETE RESTRICT ON UPDATE CASCADE;
