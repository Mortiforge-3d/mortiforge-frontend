/*
  Warnings:

  - Added the required column `projectType` to the `PrintRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrintRequest" ADD COLUMN     "projectType" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
