-- AlterTable
ALTER TABLE "User"
ADD COLUMN "is_anonymized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3);
