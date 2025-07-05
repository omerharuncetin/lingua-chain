import { BADGE_ABI } from '../config/abi'
import { walletClient } from '../lib/viemClient'
import { Address } from 'viem/_types'

export class BlockchainService {
  public async createNewBadge(badgeAddress: Address, to: Address) {
    await walletClient.writeContract({
      abi: BADGE_ABI,
      account: walletClient.account,
      functionName: 'safeMint',
      address: badgeAddress,
      args: [to],
    })
  }
}
