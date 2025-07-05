import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// GET /api/avatars - Get all available avatars
router.get('/', async (req: Request, res: Response) => {
  try {
    const avatars = await prisma.avatar.findMany({
      orderBy: { // Optional: order by name or price, for example
        name: 'asc',
      },
    });
    res.json(avatars);
  } catch (error) {
    console.error('Failed to retrieve avatars:', error);
    res.status(500).json({ error: 'Failed to retrieve avatars' });
  }
});

// GET /api/avatars/:id - Get a specific avatar by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const avatar = await prisma.avatar.findUnique({
      where: { id },
    });
    if (avatar) {
      res.json(avatar);
    } else {
      res.status(404).json({ error: 'Avatar not found' });
    }
  } catch (error) {
    console.error(`Failed to retrieve avatar ${id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve avatar' });
  }
});

// Future considerations (Admin CRUD for Avatars):
// POST /api/avatars - Create a new avatar (Admin only)
/*
router.post('/', async (req: Request, res: Response) => {
  // Add authentication/authorization middleware to ensure only admins can access
  const { name, description, price, imageUrl } = req.body;
  if (!name || typeof price !== 'number' || !imageUrl) {
    return res.status(400).json({ error: 'Name, price, and imageUrl are required for an avatar.' });
  }
  try {
    const newAvatar = await prisma.avatar.create({
      data: { name, description, price, imageUrl },
    });
    res.status(201).json(newAvatar);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return res.status(409).json({ error: 'Avatar with this name already exists' });
    }
    console.error('Failed to create avatar:', error);
    res.status(500).json({ error: 'Failed to create avatar' });
  }
});
*/

// PUT /api/avatars/:id - Update an avatar (Admin only)
/*
router.put('/:id', async (req: Request, res: Response) => {
  // Add authentication/authorization middleware
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;
  try {
    const updatedAvatar = await prisma.avatar.update({
      where: { id },
      data: { name, description, price, imageUrl }, // Ensure to handle partial updates if desired
    });
    res.json(updatedAvatar);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return res.status(409).json({ error: 'Avatar with this name already exists (if name is being changed to an existing one)' });
    }
    console.error(`Failed to update avatar ${id}:`, error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});
*/

// DELETE /api/avatars/:id - Delete an avatar (Admin only)
/*
router.delete('/:id', async (req: Request, res: Response) => {
  // Add authentication/authorization middleware
  const { id } = req.params;
  try {
    await prisma.avatar.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    // Consider P2003 if UserAvatar entries prevent deletion without cascading or explicit handling
    console.error(`Failed to delete avatar ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});
*/

export default router;
