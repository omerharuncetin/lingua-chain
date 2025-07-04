import express, { Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = express.Router({ mergeParams: true }) // mergeParams allows access to :userId from parent router

// POST /api/users/:userId/progress - Create or update user progress for a language
// Expects language and lesson in the body.
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { language, lesson } = req.body

  if (!language || typeof lesson !== 'number' || lesson < 1 || lesson > 10) {
    return res.status(400).json({ error: 'Language and a valid lesson number (1-10) are required.' })
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_language: {
          userId,
          language,
        },
      },
      update: { lesson },
      create: {
        userId,
        language,
        lesson,
      },
    })
    res.status(201).json(userProgress)
  } catch (error) {
    console.error(`Failed to create/update progress for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to save user progress' })
  }
})

// GET /api/users/:userId/progress - Get all progress for a user
router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
    })
    res.json(progress)
  } catch (error) {
    console.error(`Failed to retrieve progress for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to retrieve user progress' })
  }
})

// GET /api/users/:userId/progress/:language - Get specific language progress for a user
router.get('/:language', async (req: Request, res: Response) => {
  const { userId, language } = req.params
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const progressItem = await prisma.userProgress.findUnique({
      where: {
        userId_language: {
          userId,
          language,
        },
      },
    })
    if (progressItem) {
      res.json(progressItem)
    } else {
      res.status(404).json({ error: 'Progress for this language not found for the user' })
    }
  } catch (error) {
    console.error(`Failed to retrieve progress for user ${userId}, language ${language}:`, error)
    res.status(500).json({ error: 'Failed to retrieve user progress' })
  }
})

// PUT /api/users/:userId/progress/:language - Update user progress (e.g., advance lesson)
router.put('/:language', async (req: Request, res: Response) => {
  const { userId, language } = req.params
  const { lesson } = req.body

  if (typeof lesson !== 'number' || lesson < 1 || lesson > 10) {
    return res.status(400).json({ error: 'A valid lesson number (1-10) is required.' })
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const updatedProgress = await prisma.userProgress.update({
      where: {
        userId_language: {
          userId,
          language,
        },
      },
      data: { lesson },
    })
    res.json(updatedProgress)
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record to update not found
      return res.status(404).json({ error: 'Progress for this language not found for the user' })
    }
    console.error(`Failed to update progress for user ${userId}, language ${language}:`, error)
    res.status(500).json({ error: 'Failed to update user progress' })
  }
})

// DELETE /api/users/:userId/progress/:language - Delete specific language progress
router.delete('/:language', async (req: Request, res: Response) => {
  const { userId, language } = req.params
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    await prisma.userProgress.delete({
      where: {
        userId_language: {
          userId,
          language,
        },
      },
    })
    res.status(204).send()
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record to delete not found
      return res.status(404).json({ error: 'Progress for this language not found for the user' })
    }
    console.error(`Failed to delete progress for user ${userId}, language ${language}:`, error)
    res.status(500).json({ error: 'Failed to delete user progress' })
  }
})

export default router
