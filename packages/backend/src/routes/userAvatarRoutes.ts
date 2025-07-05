import express, { Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = express.Router({ mergeParams: true }) // mergeParams allows access to :userId from parent router

// POST /api/users/:userId/avatars - Record a user purchasing/owning an avatar
// Expects avatarId in the body
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { avatarId } = req.body

  if (!avatarId) {
    return res.status(400).json({ error: 'avatarId is required in the request body.' })
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' })
    }

    // Check if avatar exists
    const avatarExists = await prisma.avatar.findUnique({ where: { id: avatarId } })
    if (!avatarExists) {
      return res.status(404).json({ error: 'Avatar not found.' })
    }

    // Check if user already owns this avatar (optional, based on requirements)
    const existingUserAvatar = await prisma.userAvatar.findUnique({
      where: { userId_avatarId: { userId, avatarId } },
    })
    if (existingUserAvatar) {
      return res.status(409).json({ error: 'User already owns this avatar.' })
    }

    const newUserAvatar = await prisma.userAvatar.create({
      data: {
        userId,
        avatarId,
        // purchaseDate is defaulted by Prisma schema
      },
      include: {
        avatar: true, // Include avatar details in the response
      },
    })
    res.status(201).json(newUserAvatar)
  } catch (error: any) {
    if (error.code === 'P2003') {
      // Foreign key constraint failed
      if (error.meta?.field_name?.includes('userId')) {
        return res.status(400).json({ error: `User with ID ${userId} does not exist.` })
      }
      if (error.meta?.field_name?.includes('avatarId')) {
        return res.status(400).json({ error: `Avatar with ID ${avatarId} does not exist.` })
      }
    }
    if (error.code === 'P2002') {
      // Unique constraint failed (should be caught by pre-check, but as a fallback)
      return res.status(409).json({ error: 'User already owns this avatar (duplicate entry attempted).' })
    }
    console.error(`Failed to assign avatar ${avatarId} to user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to assign avatar to user' })
  }
})

// GET /api/users/:userId/avatars - Get all avatars owned by a user
router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const userAvatars = await prisma.userAvatar.findMany({
      where: { userId },
      include: {
        avatar: true, // Include full avatar details
      },
      orderBy: {
        purchaseDate: 'desc', // Optional: order by purchase date
      },
    })
    res.json(userAvatars)
  } catch (error) {
    console.error(`Failed to retrieve avatars for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to retrieve user avatars' })
  }
})

// DELETE /api/users/:userId/avatars/:userAvatarId - Remove an avatar ownership entry
// Note: Using userAvatarId (the ID of the UserAvatar record itself) for deletion.
// Alternatively, one could use DELETE /api/users/:userId/avatars/:avatarId (using avatarId in path)
// but this would require fetching the UserAvatar record first to get its ID if the primary key is just 'id'.
// The current schema uses `@@unique([userId, avatarId])`, so we can use that if we prefer.
// Let's stick to the plan which mentions `/api/users/:userId/avatars/:userAvatarId`.
// This implies UserAvatar has its own distinct 'id'. Indeed it does: `id String @id @default(cuid())`

router.delete('/:userAvatarId', async (req: Request, res: Response) => {
  const { userId, userAvatarId } = req.params

  try {
    // Optional: Check if the userAvatarId actually belongs to the userId in the path
    // This adds an extra layer of security/validation.
    const userAvatarEntry = await prisma.userAvatar.findUnique({
      where: { id: userAvatarId },
    })

    if (!userAvatarEntry) {
      return res.status(404).json({ error: 'UserAvatar entry not found.' })
    }

    if (userAvatarEntry.userId !== userId) {
      // This means the userAvatarId exists, but not for the user specified in the URL path.
      return res
        .status(403)
        .json({ error: 'Forbidden: This avatar ownership record does not belong to the specified user.' })
    }

    await prisma.userAvatar.delete({
      where: {
        id: userAvatarId,
        // We could also use:
        // userId_avatarId: { userId, avatarId } // if we passed avatarId instead of userAvatarId
      },
    })
    res.status(204).send()
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record to delete not found
      return res.status(404).json({ error: 'UserAvatar entry not found for deletion.' })
    }
    console.error(`Failed to delete user avatar entry ${userAvatarId} for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to delete user avatar entry' })
  }
})

export default router
