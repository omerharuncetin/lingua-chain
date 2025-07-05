import { Address, createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/_types/accounts'
import { celoAlfajores } from 'viem/chains'

// Configure the Public Client for Celo Alfajores Testnet
// You can add a custom transport if you have a specific RPC provider URL,
// otherwise, Viem will use the default public RPC for Celo Alfajores.
const account = privateKeyToAccount(process.env.PRIVATE_KEY as Address)

export const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(), // Uses default public RPC. Replace with http('YOUR_RPC_URL') if needed.
})

export const walletClient = createWalletClient({
  chain: celoAlfajores,
  account,
  transport: http(), // Uses default public RPC. Replace with http('YOUR_RPC_URL') if needed.
})

// You can also create a Wallet Client if your service needs to send transactions,
// but for listening to events, a Public Client is sufficient.

console.log(`Viem Public Client configured for: ${walletClient.chain.name}`)

// Example of how to potentially use it (optional, just for testing the client setup)
// async function getBlockNumber() {
//   try {
//     const blockNumber = await publicClient.getBlockNumber();
//     console.log('Current Celo Alfajores block number:', blockNumber);
//   } catch (error) {
//     console.error('Error fetching block number:', error);
//   }
// }
// getBlockNumber();
