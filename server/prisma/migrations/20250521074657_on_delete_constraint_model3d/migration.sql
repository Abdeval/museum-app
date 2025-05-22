-- DropForeignKey
ALTER TABLE "Model3D" DROP CONSTRAINT "Model3D_exhibitId_fkey";

-- AddForeignKey
ALTER TABLE "Model3D" ADD CONSTRAINT "Model3D_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
