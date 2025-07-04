import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  const { walletAddress, username } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        walletAddress,
        username,
      },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('walletAddress')) {
      return res.status(409).json({ error: 'User with this wallet address already exists' });
    }
    console.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/users - Get all users (filterable by walletAddress)
router.get('/', async (req: Request, res: Response) => {
  const { walletAddress } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        walletAddress: walletAddress ? String(walletAddress) : undefined,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET /api/users/:id - Get a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { // Optionally include related data
        progress: true,
        leaderboard: true,
        avatars: true,
        certificates: true,
        badges: true,
      }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(`Failed to retrieve user ${id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// PUT /api/users/:id - Update a user's username
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;

  if (typeof username !== 'string' || username.trim() === '') {
    // Allow unsetting username with null or empty string if desired, adjust validation as needed
     // For now, let's assume username must be a non-empty string if provided
    return res.status(400).json({ error: 'Username must be a non-empty string if provided' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { username },
    });
    res.json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to update not found
      return res.status(404).json({ error: 'User not found' });
    }
    console.error(`Failed to update user ${id}:`, error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to delete not found
      return res.status(404).json({ error: 'User not found' });
    }
    // Handle other potential errors, e.g., P2003 (foreign key constraint) if user has related records
    // that are not set to cascade delete or be nullified. The schema has cascade deletes for some relations.
    console.error(`Failed to delete user ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
