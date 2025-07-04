import express, { Request, Response } from 'express'

const router = express.Router()

const LANGUAGE_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

// Helper function to generate static metadata for a given level and type
const getStaticNftMetadata = (level: string, type: 'Badge' | 'Certificate', tokenId: string) => {
  // Ensure level is valid and lowercase
  const lowerLevel = level.toLowerCase()
  if (!LANGUAGE_LEVELS.includes(lowerLevel)) {
    return null // Invalid level
  }

  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001'; // Fallback to localhost if not set

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

export default router
