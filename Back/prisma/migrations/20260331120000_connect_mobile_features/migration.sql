-- AlterTable
ALTER TABLE "Resources"
ADD COLUMN "summary" TEXT,
ADD COLUMN "format" TEXT,
ADD COLUMN "relation" TEXT,
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserResourceProgress" (
    "user_id" INTEGER NOT NULL,
    "ressource_id" INTEGER NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "is_saved_for_later" BOOLEAN NOT NULL DEFAULT false,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserResourceProgress_pkey" PRIMARY KEY ("user_id","ressource_id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "activity_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "ressource_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "ActivityParticipant" (
    "participant_id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityParticipant_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "ActivityMessage" (
    "message_id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "author_name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityMessage_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "UserResourceProgress"
ADD CONSTRAINT "UserResourceProgress_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResourceProgress"
ADD CONSTRAINT "UserResourceProgress_ressource_id_fkey"
FOREIGN KEY ("ressource_id") REFERENCES "Resources"("ressource_id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity"
ADD CONSTRAINT "Activity_owner_id_fkey"
FOREIGN KEY ("owner_id") REFERENCES "User"("user_id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity"
ADD CONSTRAINT "Activity_ressource_id_fkey"
FOREIGN KEY ("ressource_id") REFERENCES "Resources"("ressource_id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityParticipant"
ADD CONSTRAINT "ActivityParticipant_activity_id_fkey"
FOREIGN KEY ("activity_id") REFERENCES "Activity"("activity_id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityMessage"
ADD CONSTRAINT "ActivityMessage_activity_id_fkey"
FOREIGN KEY ("activity_id") REFERENCES "Activity"("activity_id")
ON DELETE CASCADE ON UPDATE CASCADE;
