import { BADGE_ABI } from '../config/abi'
import { walletClient } from '../lib/viemClient'
import { Address } from 'viem/_types'
import { writeContract } from 'viem/_types/actions/wallet/writeContract'

export class BlockchainService {
  public async createNewBadge(badgeAddress: Address, to: Address) {
    await writeContract(walletClient, {
      abi: BADGE_ABI,
      account: walletClient.account,
      functionName: 'safeMint',
      address: badgeAddress,
      args: [to],
    })
  }
}
