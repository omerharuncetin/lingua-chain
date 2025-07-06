import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WalrusMetadata {
    name?: string;
    description?: string;
    tags?: string[];
    userId?: string;
}

interface WalrusStoreResult {
    blobId: string;
    dbId: string;
    size: number;
}

interface WalrusBlobData {
    blobId: string;
    objectId?: string;
    size: number;
    cost?: number;
    startEpoch?: number;
    endEpoch?: number;
}

interface PaginationResult<T> {
    blobs: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class WalrusStorageService {
    private publisherUrl: string;
    private aggregatorUrl: string;

    constructor() {
        this.publisherUrl = 'https://publisher.walrus-testnet.walrus.space';
        this.aggregatorUrl = 'https://aggregator.walrus-testnet.walrus.space';
    }

    async storeJson(jsonData: any, metadata: WalrusMetadata = {}, epochs: number = 5): Promise<WalrusStoreResult> {
        try {
            const jsonString = JSON.stringify(jsonData);

            const response = await axios.put(
                `${this.publisherUrl}/v1/blobs?epochs=${epochs}`,
                jsonString,
                {
                    headers: { 'Content-Type': 'application/octet-stream' },
                    timeout: 60000
                }
            );

            let blobData: WalrusBlobData;
            if (response.data.newlyCreated) {
                blobData = {
                    blobId: response.data.newlyCreated.blobObject.blobId,
                    objectId: response.data.newlyCreated.blobObject.id,
                    size: response.data.newlyCreated.blobObject.size,
                    cost: response.data.newlyCreated.cost,
                    startEpoch: response.data.newlyCreated.blobObject.storage.startEpoch,
                    endEpoch: response.data.newlyCreated.blobObject.storage.endEpoch
                };
            } else if (response.data.alreadyCertified) {
                blobData = {
                    blobId: response.data.alreadyCertified.blobId,
                    endEpoch: response.data.alreadyCertified.endEpoch,
                    size: jsonString.length
                };
            } else {
                throw new Error('Unexpected response format');
            }


            const dbRecord = await prisma.walrusBlob.create({
                data: {
                    blobId: blobData.blobId,
                    objectId: blobData.objectId || null,
                    name: metadata.name || null,
                    description: metadata.description || null,
                    tags: metadata.tags || [],
                    userId: metadata.userId || null,
                    size: blobData.size,
                    cost: blobData.cost || null,
                    startEpoch: blobData.startEpoch || null,
                    endEpoch: blobData.endEpoch || null
                }
            });

            return {
                blobId: blobData.blobId,
                dbId: dbRecord.id,
                size: blobData.size
            };
        } catch (error: any) {
            throw new Error(`Storage failed: ${error.message}`);
        }
    }

    async retrieveJson<T = any>(blobId: string): Promise<T> {
        try {
            const response = await axios.get(`${this.aggregatorUrl}/v1/blobs/${blobId}`, {
                timeout: 30000
            });
            return JSON.parse(response.data);
        } catch (error: any) {
            throw new Error(`Retrieve failed: ${error.message}`);
        }
    }

    async getBlobInfo(blobId: string) {
        const record = await prisma.walrusBlob.findUnique({
            where: { blobId }
        });
        if (!record) throw new Error('Blob not found');
        return record;
    }

    async listBlobs(userId?: string | null, page: number = 1, limit: number = 10): Promise<PaginationResult<any>> {
        const skip = (page - 1) * limit;
        const where = userId ? { userId, isDeleted: false } : { isDeleted: false };

        const [blobs, total] = await Promise.all([
            prisma.walrusBlob.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.walrusBlob.count({ where })
        ]);

        return {
            blobs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        };
    }

    async markAsDeleted(blobId: string) {
        const record = await prisma.walrusBlob.update({
            where: { blobId },
            data: { isDeleted: true }
        });
        return record;
    }
}

export default WalrusStorageService;
export type { WalrusMetadata, WalrusStoreResult };