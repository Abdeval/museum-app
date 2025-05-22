-- CreateTable
CREATE TABLE "RecommendedExhibit" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "exhibitId" INTEGER NOT NULL,

    CONSTRAINT "RecommendedExhibit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecommendedExhibit" ADD CONSTRAINT "RecommendedExhibit_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedExhibit" ADD CONSTRAINT "RecommendedExhibit_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
