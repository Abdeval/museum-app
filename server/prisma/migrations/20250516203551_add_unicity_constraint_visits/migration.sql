/*
  Warnings:

  - A unique constraint covering the columns `[userId,exhibitId]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Visit_userId_exhibitId_key" ON "Visit"("userId", "exhibitId");
