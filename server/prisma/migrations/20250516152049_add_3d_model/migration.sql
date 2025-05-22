-- CreateTable
CREATE TABLE "Model3D" (
    "id" SERIAL NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "exhibitId" INTEGER NOT NULL,

    CONSTRAINT "Model3D_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model3D_exhibitId_key" ON "Model3D"("exhibitId");

-- AddForeignKey
ALTER TABLE "Model3D" ADD CONSTRAINT "Model3D_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
