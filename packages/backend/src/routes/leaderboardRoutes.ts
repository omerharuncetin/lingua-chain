import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// POST /api/leaderboard - Add or update a leaderboard entry
router.post('/', async (req: Request, res: Response) => {
  const { userId, language, points } = req.body;

  if (!userId || !language || typeof points !== 'number') {
    return res.status(400).json({ error: 'userId, language, and a numeric points value are required.' });
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found. Cannot create leaderboard entry.' });
    }

    const entry = await prisma.leaderboardEntry.upsert({
      where: {
        userId_language: {
          userId,
          language,
        },
      },
      update: { points }, // Or use { points: { increment: points } } if points are additive
      create: {
        userId,
        language,
        points,
      },
      include: { user: { select: { username: true, walletAddress: true } } },
    });
    res.status(201).json(entry);
  } catch (error: any) {
    // P2003: Foreign key constraint failed on the field: `userId`
    if (error.code === 'P2003' && error.meta?.field_name?.includes('userId')) {
        return res.status(400).json({ error: `User with ID ${userId} does not exist.` });
    }
    console.error('Failed to create/update leaderboard entry:', error);
    res.status(500).json({ error: 'Failed to save leaderboard entry' });
  }
});

// GET /api/leaderboard - Get leaderboard entries (filterable by language)
router.get('/', async (req: Request, res: Response) => {
  const { language, sortBy = 'points', order = 'desc', limit = 100, page = 1 } = req.query;

  const pageNum = parseInt(String(page), 10);
  const limitNum = parseInt(String(limit), 10);
  const skip = (pageNum - 1) * limitNum;


  if (Number.isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Page must be a positive integer.'});
  }
  if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 1000) { // Max limit
     return res.status(400).json({ error: 'Limit must be a positive integer (max 1000).'});
  }
  if (!['points', 'createdAt', 'updatedAt'].includes(String(sortBy))) {
    return res.status(400).json({ error: 'Invalid sortBy parameter. Allowed: points, createdAt, updatedAt.' });
  }
  if (!['asc', 'desc'].includes(String(order))) {
    return res.status(400).json({ error: 'Invalid order parameter. Allowed: asc, desc.' });
  }

  try {
    const entries = await prisma.leaderboardEntry.findMany({
      where: {
        language: language ? String(language) : undefined,
      },
      include: { user: { select: { username: true, walletAddress: true } } },
      orderBy: {
        [String(sortBy)]: String(order),
      },
      take: limitNum,
      skip: skip,
    });

    const totalEntries = await prisma.leaderboardEntry.count({
        where: { language: language ? String(language) : undefined, }
    });

    res.json({
        data: entries,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalEntries / limitNum),
        totalEntries
    });
  } catch (error) {
    console.error('Failed to retrieve leaderboard entries:', error);
    res.status(500).json({ error: 'Failed to retrieve leaderboard entries' });
  }
});

// GET /api/leaderboard/:id - Get a specific leaderboard entry by its own ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const entry = await prisma.leaderboardEntry.findUnique({
      where: { id },
      include: { user: { select: { username: true, walletAddress: true } } },
    });
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ error: 'Leaderboard entry not found' });
    }
  } catch (error) {
    console.error(`Failed to retrieve leaderboard entry ${id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve leaderboard entry' });
  }
});

// PUT /api/leaderboard/:id - Update a leaderboard entry's points
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { points } = req.body;

  if (typeof points !== 'number') {
    return res.status(400).json({ error: 'Points must be a numeric value.' });
  }

  try {
    const updatedEntry = await prisma.leaderboardEntry.update({
      where: { id },
      data: { points },
      include: { user: { select: { username: true, walletAddress: true } } },
    });
    res.json(updatedEntry);
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to update not found
      return res.status(404).json({ error: 'Leaderboard entry not found' });
    }
    console.error(`Failed to update leaderboard entry ${id}:`, error);
    res.status(500).json({ error: 'Failed to update leaderboard entry' });
  }
});

// DELETE /api/leaderboard/:id - Delete a leaderboard entry
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.leaderboardEntry.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to delete not found
      return res.status(404).json({ error: 'Leaderboard entry not found' });
    }
    console.error(`Failed to delete leaderboard entry ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete leaderboard entry' });
  }
});

export default router;
