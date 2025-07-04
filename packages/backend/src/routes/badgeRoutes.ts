import express, { Request, Response } from 'express';

const router = express.Router();

// Valid language levels
constVALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * GET /api/badges/:level/
 * Returns a placeholder image/message for the badge of a given level.
 */
router.get('/:level/', (req: Request, res: Response) => {
  const { level } = req.params;

  if (!VALID_LEVELS.includes(level.toUpperCase())) {
    return res.status(400).json({ error: `Invalid language level: ${level}. Valid levels are ${VALID_LEVELS.join(', ')}.` });
  }

  // In a real application, you would fetch user data, check if they earned the badge,
  // and then return an actual image or link to an NFT.
  // For now, we return a placeholder.
  //
  // This also assumes that the user's identity is handled elsewhere (e.g., via a JWT middleware)
  // if these badges are user-specific. The current path doesn't include a user ID.

  res.json({
    message: `Placeholder for badge for level ${level.toUpperCase()}.`,
    level: level.toUpperCase(),
    imageUrl: `https://example.com/images/badges/${level.toUpperCase()}.png` // Placeholder image URL
  });
});

export default router;
