-- CreateTable
CREATE TABLE "Report" (
    "report_id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER,
    "replie_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comments"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_replie_id_fkey" FOREIGN KEY ("replie_id") REFERENCES "RepliesComment"("replie_id") ON DELETE SET NULL ON UPDATE CASCADE;
