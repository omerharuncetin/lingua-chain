-- AlterTable
ALTER TABLE "DailyLessonRecord" ADD COLUMN     "blobId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "blobId" TEXT NOT NULL DEFAULT '';
