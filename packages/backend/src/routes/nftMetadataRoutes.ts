import express, { Request, Response } from 'express'
import prisma from '../lib/prisma'
import 'dotenv/config'

const router = express.Router()

const LANGUAGE_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

// Helper function to generate static metadata for a given level and type
const getStaticNftMetadata = (level: string, type: 'Badge' | 'Certificate', tokenId: string) => {
  // Ensure level is valid and lowercase
  const lowerLevel = level.toLowerCase()
  if (!LANGUAGE_LEVELS.includes(lowerLevel)) {
    return null // Invalid level
  }

  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001' // Fallback to localhost if not set

  // Customize this metadata as needed. This is just a placeholder structure.
  // In a real scenario, these details would be more specific to your NFTs.
  const metadata = {
    name: `${type} of ${lowerLevel.toUpperCase()} Completion`,
    description: `This ${type.toLowerCase()} certifies (or represents) the completion of the ${lowerLevel.toUpperCase()} language level. Token ID: ${tokenId}.`,
    // Construct image URL using API_BASE_URL and conventional path
    image: `${apiBaseUrl}/images/nfts/${type.toLowerCase()}s/${lowerLevel}.png`, // e.g., https://hackathon.omerharuncetin.com/images/nfts/badges/a1.png
    attributes: [
      {
        trait_type: 'Level',
        value: lowerLevel.toUpperCase(),
      },
      {
        trait_type: 'Type',
        value: type,
      },
      {
        trait_type: 'Token ID',
        value: tokenId,
      },
      // Add more attributes as needed
    ],
    // external_url: `https://yourapp.com/profile/item/${type.toLowerCase()}/${lowerLevel}/${tokenId}` // Optional
  }
  return metadata
}

// Helper to convert slug to Title Case Name (simple version)
// e.g., "polyglot-panda" -> "Polyglot Panda"
// e.g., "lingobot" -> "LingoBot"
const slugToAvatarName = (slug: string): string => {
  if (slug === 'lingobot') return 'LingoBot' // Handle specific case for correct capitalization
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const AVATAR_SLUGS = ['lingobot', 'polyglot-panda', 'grammar-goblin', 'syntax-seraph', 'verb-viper']

// --- Badge NFT Metadata Endpoints ---
// GET /api/nft/badges/<level>/:tokenId
LANGUAGE_LEVELS.forEach((level) => {
  router.get(`/badges/${level}/:tokenId`, (req: Request, res: Response) => {
    const { tokenId } = req.params
    const metadata = getStaticNftMetadata(level, 'Badge', tokenId)

    if (!metadata) {
      // This should not happen if routes are set up correctly with LANGUAGE_LEVELS
      return res.status(400).json({ error: `Invalid language level provided in path: ${level}` })
    }

    // Log that this specific endpoint was hit, including the tokenId from the path
    console.log(`Serving metadata for Badge Level: ${level}, TokenID: ${tokenId}`)
    res.json(metadata)
  })
})

// --- Certificate NFT Metadata Endpoints ---
// GET /api/nft/certificates/<level>/:tokenId
LANGUAGE_LEVELS.forEach((level) => {
  router.get(`/certificates/${level}/:tokenId`, (req: Request, res: Response) => {
    const { tokenId } = req.params
    const metadata = getStaticNftMetadata(level, 'Certificate', tokenId)

    if (!metadata) {
      // This should not happen
      return res.status(400).json({ error: `Invalid language level provided in path: ${level}` })
    }

    // Log that this specific endpoint was hit
    console.log(`Serving metadata for Certificate Level: ${level}, TokenID: ${tokenId}`)
    res.json(metadata)
  })
})

// --- Avatar NFT Metadata Endpoints ---
// GET /api/nft/avatars/<avatar_slug>/:tokenId
AVATAR_SLUGS.forEach((slug) => {
  router.get(`/avatars/${slug}/:tokenId`, async (req: Request, res: Response) => {
    const { tokenId } = req.params
    const avatarName = slugToAvatarName(slug)
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001'

    try {
      const avatar = await prisma.avatar.findUnique({
        where: { name: avatarName },
      })

      if (!avatar) {
        return res.status(404).json({ error: `Avatar with name ${avatarName} (slug: ${slug}) not found in database.` })
      }

      // Construct metadata for the avatar
      const metadata = {
        name: avatar.name,
        description: avatar.description || `A unique ${avatar.name} avatar. Token ID: ${tokenId}.`,
        image: avatar.imageUrl ? `${apiBaseUrl}/${avatar.imageUrl}` : `${apiBaseUrl}/images/nfts/avatars/default.png`, // Ensure imageUrl starts with a / if it's a path
        // external_url: `${apiBaseUrl}/marketplace/avatar/${slug}`, // Optional
        attributes: [
          {
            trait_type: 'Type',
            value: 'Avatar',
          },
          {
            trait_type: 'Name',
            value: avatar.name,
          },
          {
            trait_type: 'Lessons',
            value: avatar.lessons,
          },
          {
            trait_type: 'Price', // Price might not always be relevant for NFT metadata directly unless it's for display
            value: avatar.price,
          },
          {
            trait_type: 'Token ID',
            value: tokenId,
          },
          // Add other avatar-specific attributes from the `avatar` object if needed
        ],
      }

      console.log(`Serving metadata for Avatar: ${avatarName} (Slug: ${slug}), TokenID: ${tokenId}`)
      res.json(metadata)
    } catch (error) {
      console.error(`Error fetching avatar ${avatarName} for metadata:`, error)
      res.status(500).json({ error: `Failed to retrieve metadata for avatar ${avatarName}` })
    }
  })
})

export default router
