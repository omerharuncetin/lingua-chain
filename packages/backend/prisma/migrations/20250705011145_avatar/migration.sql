/*
  Warnings:

  - Added the required column `lessons` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" ADD COLUMN     "lessons" INTEGER NOT NULL;
