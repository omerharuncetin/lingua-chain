-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "transactionHash" TEXT NOT NULL DEFAULT 'test';

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "transactionHash" TEXT NOT NULL DEFAULT 'test';
