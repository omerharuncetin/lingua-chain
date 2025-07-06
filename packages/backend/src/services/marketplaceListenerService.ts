import { Log, decodeEventLog } from 'viem'
import { webSocketclient } from '../lib/viemClient'
import prisma from '../lib/prisma'
import { MARKETPLACE_ADDRESS } from '../config/contractConfig'
import { MARKETPLACE_ABI } from '../config/abi'

async function handlePurchaseEvent(log: Log) {
  const topic = decodeEventLog({
    abi: MARKETPLACE_ABI,
    topics: log.topics,
    data: log.data,
  })

  if (topic.eventName !== 'Purchased') {
    return
  }

  const { buyer, nftIndex, price } = topic.args

  console.log(`[Marketplace Listener] Purchase event detected: Avatar ${nftIndex} minted to ${buyer} with ${price}.`)

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { walletAddress: buyer.toLowerCase() }, // Ensure wallet addresses are stored/compared consistently (e.g. lowercase)
    })

    if (!user) {
      console.log(`[Marketplace Listener] User with wallet address ${buyer} not found. Skipping avatar creation.`)
      return
    }

    const avatar = await prisma.avatar.findFirst({
      where: { blockchainIndex: Number(nftIndex.toString()) },
    })

    if (!avatar) {
      console.log(`[Marketplace Listener] Avatar with index ${nftIndex} not found. Skipping avatar creation.`)
      return
    }

    await prisma.userAvatar.create({
      data: {
        userId: user.id,
        avatarId: avatar.id,
        purchaseDate: new Date(),
      },
    })
  } catch (error: any) {
    console.error(`[Marketplace Listener] Error processing Purchased event for token ${nftIndex}:`, error)
  }
}

export function initializeMarketplaceListener() {
  if (!MARKETPLACE_ADDRESS || MARKETPLACE_ADDRESS.length === 0) {
    console.log('[Marketplace Listener Service] No contracts configured to monitor. Service will not start listeners.')
    return
  }

  console.log(`[Marketplace Listener Service] Initializing listener for Marketplace Contract`)

  try {
    webSocketclient.watchContractEvent({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      eventName: 'Purchased',
      args: {
        // We can specify `from`, `to` or `tokenId` here if we want to pre-filter by the RPC provider
        // For SBT mints, `from` would be ZERO_ADDRESS.
        // However, handling the `from` check in `handleTransferEvent` gives more flexibility
        // and ensures we process only if `from` is indeed the zero address.
      },
      onLogs: (logs: Log[]) => {
        logs.forEach((log) => handlePurchaseEvent(log))
      },
      onError: (error) => {
        console.error(`[Marketplace Listener] Error in event watcher:`, error)
      },
    })
    console.log(`[Marketplace Listener Service] Successfully started listener for Purchased events.`)
  } catch (error) {
    console.error(`[Marketplace Listener Service] Failed to initialize listener`, error)
  }
  console.log('[Marketplace Listener Service] All configured listeners have been set up.')
}

// Note: This service uses `watchContractEvent` which relies on polling or WebSockets
// depending on the Viem transport. For production, ensure your RPC provider supports
// the method used and can handle the load. WebSockets are generally preferred for real-time events.
// The default public RPC might have limitations.
// Consider error handling, retries, and handling blockchain reorganizations for robustness.
