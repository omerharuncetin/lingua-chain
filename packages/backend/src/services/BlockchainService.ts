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

  public async mintBasicAvatarForUser(to: Address) {
    const LINGO_BOT_ADDRESS = "0x6d96addcc4c037b65b1ad1fcf91e0ede122fd1c9";
    await walletClient.writeContract({
      abi: BADGE_ABI,
      account: walletClient.account,
      functionName: 'safeMint',
      address: LINGO_BOT_ADDRESS,
      args: [to],
    })
  }
}
