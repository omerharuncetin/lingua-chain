import { Abi } from 'viem';

// Standard ABI for ERC721 Transfer event
// Used if a contract-specific ABI for Transfer is not provided
export const genericErc721TransferAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const; // Using 'as const' for stricter typing with Viem

export type SbtType = 'Badge' | 'Certificate';

export interface MonitoredContract {
  contractAddress: `0x${string}`; // Viem expects hex addresses with 0x prefix
  contractName: string; // For logging and identification
  sbtType: SbtType;
  languageLevel: string; // e.g., "a1", "b2" (should be lowercase to match URL path)
  abi: Abi; // Full ABI or at least the Transfer event
}

// Example structure for monitoredContracts array.
// The actual array will be populated by the user with their contract details.
// The sbtListenerService will iterate over this array.
export const monitoredContracts: MonitoredContract[] = [
  // {
  //   contractAddress: '0xYourBadgeContractAddressForA1',
  //   contractName: 'A1LevelBadge',
  //   sbtType: 'Badge',
  //   languageLevel: 'a1',
  //   abi: genericErc721TransferAbi, // Or specific contract ABI
  // },
  // {
  //   contractAddress: '0xYourCertificateContractAddressForB2',
  //   contractName: 'B2LevelCertificate',
  //   sbtType: 'Certificate',
  //   languageLevel: 'b2',
  //   abi: genericErc721TransferAbi, // Or specific contract ABI
  // },
  // Add more contract configurations here
];

// Reminder for the user:
// 1. Populate the `monitoredContracts` array above with the actual details
//    of the SBT contracts you want to listen to on Celo Alfajores.
// 2. Ensure `languageLevel` is lowercase (e.g., 'a1', 'b1') to match the
//    URL structure of the NFT metadata endpoints like `/api/nft/badges/a1/:tokenId`.
// 3. For `abi`, you can use `genericErc721TransferAbi` if your contract
//    emits a standard ERC721 Transfer event. Otherwise, provide the specific ABI
//    for your contract (at least the part defining the Transfer event).

if (process.env.NODE_ENV !== 'test' && monitoredContracts.length === 0) {
  console.warn(
    'WARNING: The `monitoredContracts` array in `src/config/contractConfig.ts` is empty. ' +
    'The SBT listener service will not monitor any contracts. ' +
    'Please populate it with your contract details.'
  );
}
