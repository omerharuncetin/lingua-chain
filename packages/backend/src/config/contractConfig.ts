import { Abi } from 'viem'

export const MARKETPLACE_ADDRESS = '0x5ec2e78ec51de81bb048c2315175577266ae5ac8'

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
] as const // Using 'as const' for stricter typing with Viem

export type SbtType = 'Badge' | 'Certificate'

export interface MonitoredContract {
  contractAddress: `0x${string}` // Viem expects hex addresses with 0x prefix
  contractName: string // For logging and identification
  sbtType: SbtType
  languageLevel: string // e.g., "a1", "b2" (should be lowercase to match URL path)
  abi: Abi // Full ABI or at least the Transfer event
}

// Example structure for monitoredContracts array.
// The actual array will be populated by the user with their contract details.
// The sbtListenerService will iterate over this array.
export const monitoredContracts: MonitoredContract[] = [
  {
    contractAddress: '0x2b83f2749b92479ad547a2633bb8c5eae8dea1fc',
    contractName: 'LinguaA1LanguageBadge',
    sbtType: 'Badge',
    languageLevel: 'a1',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0xcde0ae3249d78031084716b548a02f8b093b2140',
    contractName: 'LinguaA2LanguageBadge',
    sbtType: 'Badge',
    languageLevel: 'a2',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0x941a47be52ebb2dfa27b57dc7a3a647e9cb5d36c',
    contractName: 'LinguaB1LanguageBadge',
    sbtType: 'Badge',
    languageLevel: 'b1',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0xe4f0e62ac601f4c51f72f5db9e9ff1576f688629',
    contractName: 'LinguaB2LanguageBadge',
    sbtType: 'Badge',
    languageLevel: 'b2',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0xd90b6cf1a10525eeceeab84aac3d583b61b1230f',
    contractName: 'LinguaC1LanguageBadge',
    sbtType: 'Badge',
    languageLevel: 'c1',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0x916189572166b9711787a5ed07dd24b1f2da10d0',
    contractName: 'LinguaC2LanguageBadge',
    sbtType: 'Badge',
    languageLevel: 'c2',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0x48fd1ccb869ec353941e6e217b2961aaebceecbe',
    contractName: 'LinguaA1Certificate',
    sbtType: 'Certificate',
    languageLevel: 'a1',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0xc1420209ca65750da33c11abe0f48a9a8f044c33',
    contractName: 'LinguaA2Certificate',
    sbtType: 'Certificate',
    languageLevel: 'a2',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0xbed78013f3f0935f04f93aa83de8a6ea61de5baa',
    contractName: 'LinguaB1Certificate',
    sbtType: 'Certificate',
    languageLevel: 'b1',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0x7b14c4c66d6d3a28ddc70ea677959c907ada9e1d',
    contractName: 'LinguaB2Certificate',
    sbtType: 'Certificate',
    languageLevel: 'b2',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0x5921361ed9cd6e67cd8870b84e6c2d4c7244d5bb',
    contractName: 'LinguaC1Certificate',
    sbtType: 'Certificate',
    languageLevel: 'c1',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  },
  {
    contractAddress: '0x2c873eaec72c11b412b5886f7be0a5995dd5357b',
    contractName: 'LinguaC2Certificate',
    sbtType: 'Certificate',
    languageLevel: 'c2',
    abi: genericErc721TransferAbi, // Or specific contract ABI
  }
]

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
  )
}
