-- CreateTable
CREATE TABLE "walrus_blobs" (
    "id" TEXT NOT NULL,
    "blobId" TEXT NOT NULL,
    "objectId" TEXT,
    "name" TEXT,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" TEXT,
    "size" INTEGER NOT NULL,
    "cost" INTEGER,
    "startEpoch" INTEGER,
    "endEpoch" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "walrus_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "walrus_blobs_blobId_key" ON "walrus_blobs"("blobId");
