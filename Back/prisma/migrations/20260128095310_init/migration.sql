-- CreateEnum
CREATE TYPE "VisibilityEnum" AS ENUM ('PUBLIC', 'PRIVATE', 'GROUP');

-- CreateEnum
CREATE TYPE "ReactionTypeEnum" AS ENUM ('LIKE', 'DISLIKE', 'LOVE', 'LAUGH');

-- CreateEnum
CREATE TYPE "CommentStatusEnum" AS ENUM ('ACTIVE', 'HIDDEN');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "street_number" INTEGER NOT NULL,
    "street_type" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "address_complement" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "GroupRelation" (
    "relation_id" SERIAL NOT NULL,
    "wording" TEXT NOT NULL,

    CONSTRAINT "GroupRelation_pkey" PRIMARY KEY ("relation_id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "ressource_id" SERIAL NOT NULL,
    "wording" TEXT NOT NULL,
    "visibility" "VisibilityEnum" NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("ressource_id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "comment_id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "status" "CommentStatusEnum" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ressource_id" INTEGER NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "RepliesComment" (
    "replie_id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,

    CONSTRAINT "RepliesComment_pkey" PRIMARY KEY ("replie_id")
);

-- CreateTable
CREATE TABLE "Group" (
    "group_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "relation_id" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "CanHave" (
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "CanHave_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "React" (
    "user_id" INTEGER NOT NULL,
    "ressource_id" INTEGER NOT NULL,
    "reaction_type" "ReactionTypeEnum",

    CONSTRAINT "React_pkey" PRIMARY KEY ("user_id","ressource_id")
);

-- CreateTable
CREATE TABLE "Views" (
    "user_id" INTEGER NOT NULL,
    "ressource_id" INTEGER NOT NULL,
    "view_number" INTEGER NOT NULL,

    CONSTRAINT "Views_pkey" PRIMARY KEY ("user_id","ressource_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_ressource_id_fkey" FOREIGN KEY ("ressource_id") REFERENCES "Resources"("ressource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliesComment" ADD CONSTRAINT "RepliesComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliesComment" ADD CONSTRAINT "RepliesComment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comments"("comment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "GroupRelation"("relation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanHave" ADD CONSTRAINT "CanHave_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanHave" ADD CONSTRAINT "CanHave_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "React" ADD CONSTRAINT "React_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "React" ADD CONSTRAINT "React_ressource_id_fkey" FOREIGN KEY ("ressource_id") REFERENCES "Resources"("ressource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_ressource_id_fkey" FOREIGN KEY ("ressource_id") REFERENCES "Resources"("ressource_id") ON DELETE RESTRICT ON UPDATE CASCADE;
