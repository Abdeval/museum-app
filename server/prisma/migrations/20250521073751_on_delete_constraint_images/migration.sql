-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_exhibitId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
