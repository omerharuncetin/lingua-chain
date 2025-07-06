import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import WalrusStorageService from '../services/WalrusStorageService';
import { WalrusMetadata } from '../services/WalrusStorageService';

const router = express.Router();

// POST /api/daily-lessons - Add or update a daily lesson record
router.post('/', async (req: Request, res: Response) => {
  const { userId, date, lessonsCompleted } = req.body;

  if (!userId || !date || typeof lessonsCompleted !== 'number') {
    return res.status(400).json({ error: 'userId, date, and a numeric lessonsCompleted value are required.' });
  }

  if (lessonsCompleted < 0) {
    return res.status(400).json({ error: 'lessonsCompleted must be a non-negative number.' });
  }

  try {
    // Parse and validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    // Set time to start of day to ensure consistent date comparison
    const dayStart = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { walletAddress: (userId as string).toLowerCase() } });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found. Cannot create daily lesson record.' });
    }

    const walrus = new WalrusStorageService();

    const metadata: WalrusMetadata = {
      name: "lesson-data",
      userId: "lingua-chain",
      tags: ["test", "json"]
    };

    const result = await walrus.storeJson({ user: userExists.walletAddress, date: dayStart.toUTCString(), lessonsCompleted: lessonsCompleted }, metadata);

    const record = await prisma.dailyLessonRecord.upsert({
      where: {
        userId_date: {
          userId: userExists.id,
          date: dayStart,
        },
      },
      update: { lessonsCompleted, blobId: result.blobId }, // Or use { lessonsCompleted: { increment: lessonsCompleted } } if additive
      create: {
        userId: userExists.id,
        date: dayStart,
        lessonsCompleted,
        blobId: result.blobId
      },
      include: { user: { select: { username: true, walletAddress: true } } },
    });




    res.status(201).json(record);
  } catch (error: any) {
    // P2003: Foreign key constraint failed on the field: `userId`
    if (error.code === 'P2003' && error.meta?.field_name?.includes('userId')) {
      return res.status(400).json({ error: `User with ID ${userId} does not exist.` });
    }
    console.error('Failed to create/update daily lesson record:', error);
    res.status(500).json({ error: 'Failed to save daily lesson record' });
  }
});

// GET /api/daily-lessons - Get daily lesson records (filterable by date range and user)
router.get('/', async (req: Request, res: Response) => {
  const {
    userId,
    startDate,
    endDate,
    sortBy = 'date',
    order = 'desc',
    limit = 100,
    page = 1
  } = req.query;

  const pageNum = parseInt(String(page), 10);
  const limitNum = parseInt(String(limit), 10);
  const skip = (pageNum - 1) * limitNum;

  if (Number.isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Page must be a positive integer.' });
  }
  if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 1000) { // Max limit
    return res.status(400).json({ error: 'Limit must be a positive integer (max 1000).' });
  }
  if (!['date', 'lessonsCompleted', 'createdAt', 'updatedAt'].includes(String(sortBy))) {
    return res.status(400).json({ error: 'Invalid sortBy parameter. Allowed: date, lessonsCompleted, createdAt, updatedAt.' });
  }
  if (!['asc', 'desc'].includes(String(order))) {
    return res.status(400).json({ error: 'Invalid order parameter. Allowed: asc, desc.' });
  }

  try {
    // Build where clause
    const whereClause: any = {};

    // Filter by userId if provided
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { walletAddress: String(userId).toLowerCase() }
      });
      if (!userExists) {
        return res.status(404).json({ error: 'User not found.' });
      }
      whereClause.userId = userExists.id;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        const parsedStartDate = new Date(String(startDate));
        if (isNaN(parsedStartDate.getTime())) {
          return res.status(400).json({ error: 'Invalid startDate format.' });
        }
        whereClause.date.gte = new Date(parsedStartDate.getFullYear(), parsedStartDate.getMonth(), parsedStartDate.getDate());
      }
      if (endDate) {
        const parsedEndDate = new Date(String(endDate));
        if (isNaN(parsedEndDate.getTime())) {
          return res.status(400).json({ error: 'Invalid endDate format.' });
        }
        whereClause.date.lte = new Date(parsedEndDate.getFullYear(), parsedEndDate.getMonth(), parsedEndDate.getDate());
      }
    }

    const records = await prisma.dailyLessonRecord.findMany({
      where: whereClause,
      include: { user: { select: { username: true, walletAddress: true } } },
      orderBy: {
        [String(sortBy)]: String(order),
      },
      take: limitNum,
      skip: skip,
    });

    const totalRecords = await prisma.dailyLessonRecord.count({
      where: whereClause
    });

    res.json({
      data: records,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalRecords / limitNum),
      totalRecords
    });
  } catch (error) {
    console.error('Failed to retrieve daily lesson records:', error);
    res.status(500).json({ error: 'Failed to retrieve daily lesson records' });
  }
});

// GET /api/daily-lessons/:id - Get a specific daily lesson record by its ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const record = await prisma.dailyLessonRecord.findUnique({
      where: { id },
      include: { user: { select: { username: true, walletAddress: true } } },
    });
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ error: 'Daily lesson record not found' });
    }
  } catch (error) {
    console.error(`Failed to retrieve daily lesson record ${id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve daily lesson record' });
  }
});

// GET /api/daily-lessons/user/:userId/date/:date - Get a specific record by user and date
router.get('/user/:userId/date/:date', async (req: Request, res: Response) => {
  const { userId, date } = req.params;

  try {
    // Parse and validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const dayStart = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { walletAddress: userId.toLowerCase() }
    });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const record = await prisma.dailyLessonRecord.findUnique({
      where: {
        userId_date: {
          userId: userExists.id,
          date: dayStart,
        },
      },
      include: { user: { select: { username: true, walletAddress: true } } },
    });

    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ error: 'Daily lesson record not found for this user and date' });
    }
  } catch (error) {
    console.error(`Failed to retrieve daily lesson record for user ${userId} and date ${date}:`, error);
    res.status(500).json({ error: 'Failed to retrieve daily lesson record' });
  }
});

// PUT /api/daily-lessons/:id - Update a daily lesson record's lessons completed
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { lessonsCompleted } = req.body;

  if (typeof lessonsCompleted !== 'number') {
    return res.status(400).json({ error: 'lessonsCompleted must be a numeric value.' });
  }

  if (lessonsCompleted < 0) {
    return res.status(400).json({ error: 'lessonsCompleted must be a non-negative number.' });
  }

  try {
    const updatedRecord = await prisma.dailyLessonRecord.update({
      where: { id },
      data: { lessonsCompleted },
      include: { user: { select: { username: true, walletAddress: true } } },
    });
    res.json(updatedRecord);
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to update not found
      return res.status(404).json({ error: 'Daily lesson record not found' });
    }
    console.error(`Failed to update daily lesson record ${id}:`, error);
    res.status(500).json({ error: 'Failed to update daily lesson record' });
  }
});

// PATCH /api/daily-lessons/:id/increment - Increment lessons completed count
router.patch('/:id/increment', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount = 1 } = req.body;

  if (typeof amount !== 'number' || amount < 1) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  try {
    const updatedRecord = await prisma.dailyLessonRecord.update({
      where: { id },
      data: {
        lessonsCompleted: {
          increment: amount
        }
      },
      include: { user: { select: { username: true, walletAddress: true } } },
    });
    res.json(updatedRecord);
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to update not found
      return res.status(404).json({ error: 'Daily lesson record not found' });
    }
    console.error(`Failed to increment daily lesson record ${id}:`, error);
    res.status(500).json({ error: 'Failed to increment daily lesson record' });
  }
});

// DELETE /api/daily-lessons/:id - Delete a daily lesson record
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.dailyLessonRecord.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to delete not found
      return res.status(404).json({ error: 'Daily lesson record not found' });
    }
    console.error(`Failed to delete daily lesson record ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete daily lesson record' });
  }
});

export default router;