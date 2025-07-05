import express, { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { BlockchainService } from '../services/BlockchainService'
import { Address } from 'viem/_types'

// This router will be mounted at /api/badges for generic level info
// and also at /api/users/:userId/badges for user-specific badges
const router = express.Router({ mergeParams: true }) // mergeParams for /users/:userId/badges

// Valid language levels - could be fetched from a config or DB in a real app
const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// --- User-specific Badge Endpoints ---
// These will be active when router is mounted under /api/users/:userId/badges

// POST /api/users/:userId/badges - Award a badge to a user
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.params // From parent router
  const { languageLevel, badgeAddress } = req.body

  if (!userId) {
    // This case should ideally not be hit if routing is set up correctly,
    // but as a safeguard if this router is somehow used standalone without :userId
    return res.status(400).json({ error: 'User ID is required in the path.' })
  }

  if (!languageLevel || !badgeAddress) {
    return res.status(400).json({ error: 'languageLevel and badgeAddress are required.' })
  }
  if (!VALID_LEVELS.includes(languageLevel.toUpperCase())) {
    return res.status(400).json({ error: `Invalid language level: ${languageLevel}.` })
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' })
    }

    // Check if user already has this specific badge (optional, based on if they can have multiple or only one per level)
    // The schema has @@unique([userId, languageLevel]) for Badge model.
    const existingBadge = await prisma.badge.findUnique({
      where: { userId_languageLevel: { userId, languageLevel } },
    })
    if (existingBadge) {
      return res.status(409).json({ error: `User already has a badge for level ${languageLevel}.` })
    }

    const progress = await prisma.userProgress.findFirst({
      where: {
        userId: userId,
        language: languageLevel,
      },
    })

    if (!progress || !progress.lesson || progress?.lesson < 10) {
      return res.status(409).json({ error: `Complete the level ${languageLevel} first! .` })
    }

    const blockchainService = new BlockchainService()

    await blockchainService.createNewBadge(badgeAddress, userExists.walletAddress as Address)

    res.status(201).json()
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint failed
      return res
        .status(409)
        .json({ error: `User already has a badge for level ${languageLevel} (database constraint).` })
    }
    if (error.code === 'P2003' && error.meta?.field_name?.includes('userId')) {
      return res.status(400).json({ error: `User with ID ${userId} does not exist.` })
    }
    console.error(`Failed to award badge to user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to award badge' })
  }
})

// GET /api/users/:userId/badges - Get all badges for a user (filterable by languageLevel)
router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.params // From parent router
  const { languageLevel } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required in the path.' })
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const badges = await prisma.badge.findMany({
      where: {
        userId,
        languageLevel: languageLevel ? String(languageLevel).toUpperCase() : undefined,
      },
      orderBy: {
        issueDate: 'desc',
      },
    })
    res.json(badges)
  } catch (error) {
    console.error(`Failed to retrieve badges for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to retrieve user badges' })
  }
})

// DELETE /api/users/:userId/badges/:badgeId - Delete a specific badge award
router.delete('/:badgeId', async (req: Request, res: Response) => {
  const { userId, badgeId } = req.params

  if (!userId || !badgeId) {
    return res.status(400).json({ error: 'User ID and Badge ID are required in the path.' })
  }

  try {
    const badge = await prisma.badge.findUnique({ where: { id: badgeId } })
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found.' })
    }
    if (badge.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: This badge does not belong to the specified user.' })
    }

    await prisma.badge.delete({
      where: { id: badgeId },
    })
    res.status(204).send()
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Badge not found for deletion.' })
    }
    console.error(`Failed to delete badge ${badgeId} for user ${userId}:`, error)
    res.status(500).json({ error: 'Failed to delete badge' })
  }
})

// --- Generic Badge Info Endpoint ---
// This will be active when router is mounted at /api/badges/:level

/**
 * GET /api/badges/:level/
 * Returns a placeholder image/message for the badge of a given level.
 * This is a generic endpoint, not user-specific.
 */
router.get('/:level', (req: Request, res: Response) => {
  // This route will only be hit if the path doesn't match /:userId/badges...
  // or if there's no :userId param (i.e. mounted directly at /api/badges)
  // We need to ensure this doesn't clash with GET /api/users/:userId/badges/:badgeId if badgeId could be a level string
  // However, badgeId is a CUID, levels are "A1", etc. So they won't clash.
  // And the :userId check for user-specific routes helps.

  const { level, userId } = req.params

  // If userId is present, it means this was matched through the user-specific path
  // but didn't match any of the user-specific handlers (e.g. if :badgeId was actually a level string).
  // This indicates a routing setup issue or a malformed request for user-specific badges.
  // For now, we assume if :userId is not present, it's a generic request.
  if (userId) {
    // This case should ideally be avoided by careful routing in index.ts
    // For example, mount user-specific badge routes *before* generic badge routes if paths could ambiguously match.
    // Or ensure the path structures are distinct enough.
    // Given current plan, user routes are /users/:userId/badges and generic is /badges/:level.
    // They will be mounted separately, so this check might be overly cautious or indicate a misunderstanding of how they'll be used together.
    // Let's assume they are mounted on different base paths, so userId won't be present for generic calls.
    // If this endpoint is reached via /api/users/:userId/badges/:level (which it shouldn't with current plan),
    // it's a misrouted request for user-specific data.
    // For now, let's proceed as if this is only for generic /api/badges/:level
    return res.status(404).json({
      error: 'Endpoint not found for user-specific level badge info. Try /api/users/:userId/badges?languageLevel=X',
    })
  }

  if (!VALID_LEVELS.includes(level.toUpperCase())) {
    return res
      .status(400)
      .json({ error: `Invalid language level: ${level}. Valid levels are ${VALID_LEVELS.join(', ')}.` })
  }

  res.json({
    message: `Generic badge information for level ${level.toUpperCase()}.`,
    level: level.toUpperCase(),
    imageUrl: `https://example.com/images/badges/${level.toUpperCase()}.png`, // Placeholder image URL
  })
})

export default router
