/*
  Warnings:

  - Added the required column `chronological_category` to the `Exhibit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thematic_category` to the `Exhibit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Exhibit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ThematicCategories" AS ENUM ('PAINTING', 'ARTIFACT', 'HISTORY', 'CULTURE');

-- CreateEnum
CREATE TYPE "ChronologicalCategories" AS ENUM ('ANCIENT_ALGERIA', 'ISLAMIC_AND_BERBER_DYNASTIES', 'OTTOMAN_AND_COLONIAL_ALGERIA', 'MODERN_AND_CONTEMPORARY_ALGERIA');

-- AlterTable
ALTER TABLE "Exhibit" ADD COLUMN     "chronological_category" "ChronologicalCategories" NOT NULL,
ADD COLUMN     "thematic_category" "ThematicCategories" NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT '/assets/avatars/1.png';
