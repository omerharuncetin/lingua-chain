import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router({ mergeParams: true }); // mergeParams for /users/:userId/certificates

const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// --- User-specific Certificate Endpoints ---
// Active when router is mounted under /api/users/:userId/certificates

// POST /api/users/:userId/certificates - Award a certificate to a user
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { languageLevel, certificateUrl } = req.body;

  if (!userId) {
     return res.status(400).json({ error: 'User ID is required in the path.'})
  }
  if (!languageLevel || !certificateUrl) {
    return res.status(400).json({ error: 'languageLevel and certificateUrl are required.' });
  }
  if (!VALID_LEVELS.includes(languageLevel.toUpperCase())) {
    return res.status(400).json({ error: `Invalid language level: ${languageLevel}.` });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Schema has @@unique([userId, languageLevel]) for Certificate model.
    const existingCertificate = await prisma.certificate.findUnique({
        where: { userId_languageLevel: { userId, languageLevel } }
    });
    if (existingCertificate) {
        return res.status(409).json({ error: `User already has a certificate for level ${languageLevel}.`})
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        userId,
        languageLevel: languageLevel.toUpperCase(),
        certificateUrl,
        // issueDate is defaulted by Prisma schema
      },
    });
    res.status(201).json(newCertificate);
  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(409).json({ error: `User already has a certificate for level ${languageLevel} (database constraint).`})
    }
    if (error.code === 'P2003' && error.meta?.field_name?.includes('userId')) {
        return res.status(400).json({ error: `User with ID ${userId} does not exist.` });
    }
    console.error(`Failed to award certificate to user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to award certificate' });
  }
});

// GET /api/users/:userId/certificates - Get all certificates for a user (filterable by languageLevel)
router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { languageLevel } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required in the path.'})
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
        languageLevel: languageLevel ? String(languageLevel).toUpperCase() : undefined,
      },
      orderBy: {
        issueDate: 'desc',
      },
    });
    res.json(certificates);
  } catch (error) {
    console.error(`Failed to retrieve certificates for user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to retrieve user certificates' });
  }
});

// DELETE /api/users/:userId/certificates/:certificateId - Delete a specific certificate award
router.delete('/:certificateId', async (req: Request, res: Response) => {
    const { userId, certificateId } = req.params;

    if (!userId || !certificateId) {
        return res.status(400).json({ error: 'User ID and Certificate ID are required in the path.'})
    }

    try {
        const certificate = await prisma.certificate.findUnique({ where: { id: certificateId }});
        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found." });
        }
        if (certificate.userId !== userId) {
            return res.status(403).json({ error: "Forbidden: This certificate does not belong to the specified user." });
        }

        await prisma.certificate.delete({
            where: { id: certificateId },
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Certificate not found for deletion.' });
        }
        console.error(`Failed to delete certificate ${certificateId} for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to delete certificate' });
    }
});


// --- Generic Certificate Info Endpoint ---
// Active when router is mounted at /api/certificates/:level

/**
 * GET /api/certificates/:level/
 * Returns a placeholder image/message for the certificate of a given level.
 * This is a generic endpoint, not user-specific.
 */
router.get('/:level', (req: Request, res: Response) => {
  const { level, userId } = req.params;

  if (userId) {
    // This indicates it was matched via /users/:userId/certificates/:level
    // which is not a defined user-specific certificate endpoint (user-specific GET is just /users/:userId/certificates)
    // This helps distinguish from the generic /certificates/:level path.
    return res.status(404).json({ error: "Endpoint not found for user-specific level certificate info. Try /api/users/:userId/certificates?languageLevel=X" });
  }

  if (!VALID_LEVELS.includes(level.toUpperCase())) {
    return res.status(400).json({ error: `Invalid language level: ${level}. Valid levels are ${VALID_LEVELS.join(', ')}.` });
  }

  res.json({
    message: `Generic certificate information for level ${level.toUpperCase()}.`,
    level: level.toUpperCase(),
    imageUrl: `https://example.com/images/certificates/${level.toUpperCase()}.png` // Placeholder image URL
  });
});

export default router;
