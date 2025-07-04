import { Log } from 'viem';
import { publicClient } from '../lib/viemClient';
import prisma from '../lib/prisma';
import { MonitoredContract, monitoredContracts } from '../config/contractConfig';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

interface TransferEventLog {
  eventName: 'Transfer';
  args: {
    from: `0x${string}`;
    to: `0x${string}`;
    tokenId: bigint; // Viem typically returns BigInt for uint256
  };
}

async function handleTransferEvent(log: Log<bigint, number, false, undefined, true, TransferEventLog['args']>, contract: MonitoredContract) {
  const { from, to, tokenId } = log.args;

  // We are only interested in mints for SBTs
  if (from !== ZERO_ADDRESS) {
    console.log(`[SBT Listener - ${contract.contractName}] Ignoring non-mint transfer for token ${tokenId} from ${from} to ${to}.`);
    return;
  }

  console.log(`[SBT Listener - ${contract.contractName}] Mint event detected: Token ${tokenId} minted to ${to}.`);

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { walletAddress: to.toLowerCase() }, // Ensure wallet addresses are stored/compared consistently (e.g. lowercase)
    });

    if (!user) {
      console.log(`[SBT Listener - ${contract.contractName}] User with wallet address ${to} not found. Skipping badge/certificate creation.`);
      return;
    }

    const tokenIdStr = tokenId.toString();
    const metadataUrl = `/api/nft/${contract.sbtType.toLowerCase()}s/${contract.languageLevel.toLowerCase()}/${tokenIdStr}`;

    if (contract.sbtType === 'Badge') {
      await prisma.badge.upsert({
        where: {
            userId_languageLevel: {
                userId: user.id,
                languageLevel: contract.languageLevel.toUpperCase() // Schema stores uppercase levels
            }
        },
        update: {
            badgeUrl: metadataUrl,
            tokenId: tokenIdStr,
            issueDate: new Date(), // Update issue date if it's an update on the same level
        },
        create: {
          userId: user.id,
          languageLevel: contract.languageLevel.toUpperCase(), // Schema stores uppercase levels
          badgeUrl: metadataUrl,
          tokenId: tokenIdStr,
        },
      });
      console.log(`[SBT Listener - ${contract.contractName}] Badge for level ${contract.languageLevel.toUpperCase()} (Token: ${tokenIdStr}) processed for user ${user.id} (${to}). URL: ${metadataUrl}`);
    } else if (contract.sbtType === 'Certificate') {
      await prisma.certificate.upsert({
        where: {
            userId_languageLevel: {
                userId: user.id,
                languageLevel: contract.languageLevel.toUpperCase()
            }
        },
        update: {
            certificateUrl: metadataUrl,
            tokenId: tokenIdStr,
            issueDate: new Date(),
        },
        create: {
          userId: user.id,
          languageLevel: contract.languageLevel.toUpperCase(),
          certificateUrl: metadataUrl,
          tokenId: tokenIdStr,
        },
      });
      console.log(`[SBT Listener - ${contract.contractName}] Certificate for level ${contract.languageLevel.toUpperCase()} (Token: ${tokenIdStr}) processed for user ${user.id} (${to}). URL: ${metadataUrl}`);
    }
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
        console.warn(`[SBT Listener - ${contract.contractName}] Failed to record ${contract.sbtType} for user ${to}, level ${contract.languageLevel} (Token ${tokenId.toString()}) due to unique constraint. It might already exist if upsert logic isn't perfect for the case or if a race condition occurred. Error: ${error.message}`);
    } else {
        console.error(`[SBT Listener - ${contract.contractName}] Error processing Transfer event for token ${tokenId}:`, error);
    }
  }
}

export function initializeSbtListeners() {
  if (monitoredContracts.length === 0) {
    console.log('[SBT Listener Service] No contracts configured to monitor. Service will not start listeners.');
    return;
  }

  console.log(`[SBT Listener Service] Initializing listeners for ${monitoredContracts.length} contract(s)...`);

  monitoredContracts.forEach((contract) => {
    console.log(`[SBT Listener Service] Setting up listener for ${contract.contractName} (${contract.contractAddress}) - Type: ${contract.sbtType}, Level: ${contract.languageLevel}`);

    try {
      publicClient.watchContractEvent({
        address: contract.contractAddress,
        abi: contract.abi,
        eventName: 'Transfer',
        args: {
          // We can specify `from`, `to` or `tokenId` here if we want to pre-filter by the RPC provider
          // For SBT mints, `from` would be ZERO_ADDRESS.
          // However, handling the `from` check in `handleTransferEvent` gives more flexibility
          // and ensures we process only if `from` is indeed the zero address.
        },
        onLogs: (logs: Log<bigint, number, false, undefined, true, TransferEventLog['args']>[]) => {
          logs.forEach(log => handleTransferEvent(log, contract));
        },
        onError: (error) => {
            console.error(`[SBT Listener - ${contract.contractName}] Error in event watcher:`, error);
        }
      });
      console.log(`[SBT Listener Service] Successfully started listener for Transfer events on ${contract.contractName}.`);
    } catch (error) {
      console.error(`[SBT Listener Service] Failed to initialize listener for ${contract.contractName}:`, error);
    }
  });
  console.log('[SBT Listener Service] All configured listeners have been set up.');
}

// Note: This service uses `watchContractEvent` which relies on polling or WebSockets
// depending on the Viem transport. For production, ensure your RPC provider supports
// the method used and can handle the load. WebSockets are generally preferred for real-time events.
// The default public RPC might have limitations.
// Consider error handling, retries, and handling blockchain reorganizations for robustness.
