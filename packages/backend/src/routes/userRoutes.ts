import express, { Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = express.Router()

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  const { walletAddress, username } = req.body

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' })
  }

  try {
    const currentUser = await prisma.user.findFirst({
      where: {
        walletAddress: (walletAddress as string).toLowerCase()
      }
    })

    if(currentUser) {
      res.status(201).json(currentUser);
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        walletAddress: (walletAddress as string).toLowerCase(),
        username,
      },
    })
    res.status(201).json(newUser)
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('walletAddress')) {
      return res.status(409).json({ error: 'User with this wallet address already exists' })
    }
    console.error('Failed to create user:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// POST /api/users/:userId/complete-lesson - Record lesson completion, check daily limit, award points
router.post('/:userId/complete-lesson', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { languageLevel } = req.body

  if (!languageLevel || typeof languageLevel !== 'string' || languageLevel.trim() === '') {
    return res.status(400).json({ error: 'languageLevel (string) is required in the request body.' })
  }

  try {
    // 1. Fetch user and their equipped avatar details
    const user = await prisma.user.findUnique({
      where: { walletAddress: userId.toLowerCase() },
      include: {
        equippedAvatar: {
          // Include the UserAvatar record
          include: {
            avatar: true, // And the base Avatar record for the lesson limit
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    if (!user.equippedAvatar || !user.equippedAvatar.avatar) {
      return res.status(400).json({ error: 'User does not have an avatar equipped or avatar details are missing.' })
    }

    const avatarDailyLimit = user.equippedAvatar.avatar.lessons

    // 2. Get current date (UTC) for DailyLessonRecord
    // Prisma stores dates in UTC. Ensure date comparisons are consistent.
    // For @db.Date, Prisma expects a Date object, but it will only store the date part.
    // When querying or creating, using a Date object set to midnight UTC for the desired day is safest.
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0) // Normalize to start of UTC day

    // 3. Find or create DailyLessonRecord for the user for today
    let dailyRecord = await prisma.dailyLessonRecord.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    })

    if (!dailyRecord) {
      dailyRecord = await prisma.dailyLessonRecord.create({
        data: {
          userId: user.id,
          date: today,
          lessonsCompleted: 0,
        },
      })
    }

    // 4. Check daily lesson limit
    if (dailyRecord.lessonsCompleted >= avatarDailyLimit) {
      return res.status(403).json({
        error: 'Daily lesson limit reached for the equipped avatar.',
        lessonsCompleted: dailyRecord.lessonsCompleted,
        limit: avatarDailyLimit,
      })
    }

    // 5. Increment lessonsCompleted and award points (in a transaction)
    const pointsToAward = 10 // Configurable: points awarded per lesson

    const [, updatedDailyRecord, updatedLeaderboardEntry] = await prisma.$transaction(async (tx) => {
      const dr = await tx.dailyLessonRecord.update({
        where: { id: dailyRecord!.id }, // dailyRecord is guaranteed to be non-null here
        data: { lessonsCompleted: { increment: 1 } },
      })

      const lb = await tx.leaderboardEntry.upsert({
        where: { userId_language: { userId: user.id, language: languageLevel.toUpperCase() } },
        update: { points: { increment: pointsToAward } },
        create: {
          userId: user.id,
          language: languageLevel.toUpperCase(),
          points: pointsToAward,
        },
      })
      return [null, dr, lb] // Placeholder for first element if needed for other operations
    })

    res.json({
      message: 'Lesson completed successfully!',
      lessonsCompletedToday: updatedDailyRecord.lessonsCompleted,
      dailyLimit: avatarDailyLimit,
      pointsAwarded: pointsToAward,
      totalPointsForLevel: updatedLeaderboardEntry.points,
      languageLevel: updatedLeaderboardEntry.language,
    })
  } catch (error) {
    console.error(`Failed to complete lesson for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to complete lesson.' })
  }
})

// GET /api/users - Get all users (filterable by walletAddress)
router.get('/', async (req: Request, res: Response) => {
  const { walletAddress } = req.query

  try {
    const users = await prisma.user.findMany({
      where: {
        walletAddress: walletAddress ? String(walletAddress).toLowerCase() : undefined,
      },
    })
    res.json(users)
  } catch (error) {
    console.error('Failed to retrieve users:', error)
    res.status(500).json({ error: 'Failed to retrieve users' })
  }
})

// GET /api/users/:id - Get a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0) // Normalize to start of UTC day

    const user = await prisma.user.findUnique({
      where: { walletAddress: id.toLowerCase() },
      include: {
        progress: true,
        leaderboard: true,
        avatars: {
          // User's owned UserAvatar records
          include: {
            avatar: true, // Include the base Avatar details for each owned UserAvatar
          },
        },
        certificates: true,
        badges: true,
        equippedAvatar: {
          // The specific UserAvatar record that is equipped
          include: {
            avatar: true, // Include the base Avatar details for the equipped UserAvatar
          },
        },
        dailyLessons: {
          // Fetch only today's lesson record
          where: {
            date: today,
          },
          take: 1, // Should only be one due to unique constraint, but good practice
        },
      },
    })

    if (user) {
      // Prisma returns dailyLessons as an array, even with take: 1. Extract the single record or null.
      const dailyLessonRecordToday = user.dailyLessons.length > 0 ? user.dailyLessons[0] : null
      // We can restructure the response slightly if we don't want dailyLessons as an array
      const userResponse = { ...user, dailyLessonRecordToday }
      // delete (userResponse as any).dailyLessons; // Clean up the array property

      res.json(userResponse)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    console.error(`Failed to retrieve user ${id}:`, error)
    res.status(500).json({ error: 'Failed to retrieve user' })
  }
})

// PUT /api/users/:id - Update a user's username
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { username } = req.body

  if (typeof username !== 'string' || username.trim() === '') {
    // Allow unsetting username with null or empty string if desired, adjust validation as needed
    // For now, let's assume username must be a non-empty string if provided
    return res.status(400).json({ error: 'Username must be a non-empty string if provided' })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { walletAddress: id.toLowerCase() },
      data: { username },
    })
    res.json(updatedUser)
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record to update not found
      return res.status(404).json({ error: 'User not found' })
    }
    console.error(`Failed to update user ${id}:`, error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.user.delete({
      where: { walletAddress: id.toLowerCase() },
    })
    res.status(204).send() // No content
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record to delete not found
      return res.status(404).json({ error: 'User not found' })
    }
    // Handle other potential errors, e.g., P2003 (foreign key constraint) if user has related records
    // that are not set to cascade delete or be nullified. The schema has cascade deletes for some relations.
    console.error(`Failed to delete user ${id}:`, error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// POST /api/users/:userId/equip-avatar - Equip an avatar for the user
router.post('/:userId/equip-avatar', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { userAvatarId } = req.body

  if (!userAvatarId) {
    return res.status(400).json({ error: 'userAvatarId is required in the request body.' })
  }

  try {
    // 1. Verify the user exists
    const user = await prisma.user.findUnique({ where: { walletAddress: userId.toLowerCase() } })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    // 2. Verify the UserAvatar entry exists and belongs to this user
    const userAvatar = await prisma.userAvatar.findUnique({
      where: { id: userAvatarId },
    })

    if (!userAvatar) {
      return res.status(404).json({ error: 'Avatar ownership record (UserAvatar) not found.' })
    }

    if (userAvatar.userId !== user.id) {
      return res.status(403).json({ error: 'This avatar does not belong to the specified user.' })
    }

    // 3. Update the user's equippedAvatarId
    //    We also need to ensure no other user has this UserAvatar equipped,
    //    which is handled by the @unique constraint on User.equippedAvatarId.
    //    If another user has it equipped, Prisma will throw a P2002 error.
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { equippedAvatarId: userAvatarId },
      include: {
        equippedAvatar: {
          include: {
            avatar: true, // Include the base avatar details
          },
        },
      },
    })

    res.json({ message: 'Avatar equipped successfully.', user: updatedUser })
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('equippedAvatarId')) {
      // This can happen if you try to equip a UserAvatar that's already equipped by another user.
      // However, given UserAvatar records are user-specific, this specific P2002 on User.equippedAvatarId
      // implies a UserAvatar ID is trying to be set on a User that another User already has set.
      // This should be rare if UserAvatar IDs are globally unique and user-specific.
      // More likely, if a user tries to equip an avatar they don't own, it's caught by the ownership check above.
      // This path might be hit if there was a race condition or data integrity issue not caught by other checks.
      // Or if User.equippedAvatarId was not unique, but it is.
      // The most direct P2002 would be if we tried to set a non-null equippedAvatarId that's already in use by another User.
      // Given equippedAvatarId on User is @unique, this means a UserAvatar can only be equipped by one User.
      return res.status(409).json({
        error:
          'This specific UserAvatar instance is already equipped by a user (should not happen if UserAvatar instances are not shared). Or, trying to set an equippedAvatarId that another user record is already using for their equipped avatar.',
      })
    }
    if (error.code === 'P2025') {
      // This would happen if the user record we are trying to update (where: { id: userId }) doesn't exist.
      // But we already checked for user existence.
      return res.status(404).json({ error: 'User not found for update (should have been caught earlier).' })
    }
    console.error(`Failed to equip avatar ${userAvatarId} for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to equip avatar.' })
  }
})

export default router
