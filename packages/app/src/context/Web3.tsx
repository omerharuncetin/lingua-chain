'use client'

import { createAppKit } from '@reown/appkit/react'
import { PropsWithChildren } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { WALLETCONNECT_ADAPTER, WALLETCONNECT_PROJECT_ID } from '@/utils/web3'
import { SITE_NAME, SITE_INFO, SITE_URL } from '@/utils/site'
import { celoAlfajores, mainnet } from '@reown/appkit/networks'

interface Props extends PropsWithChildren {
  cookies: string | null
}

const metadata = {
  name: SITE_NAME,
  description: SITE_INFO,
  url: SITE_URL,
  icons: ['https://avatars.githubusercontent.com/u/25974464'],
}

createAppKit({
  adapters: [WALLETCONNECT_ADAPTER],
  projectId: WALLETCONNECT_PROJECT_ID,
  networks: [celoAlfajores],
  defaultNetwork: celoAlfajores,
  metadata: metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    email: false,
    onramp: false,
  },
})

export function Web3Provider(props: Props) {
  const initialState = cookieToInitialState(WALLETCONNECT_ADAPTER.wagmiConfig as Config, props.cookies)

  return (
    <>
      <WagmiProvider config={WALLETCONNECT_ADAPTER.wagmiConfig as Config} initialState={initialState}>
        {props.children}
      </WagmiProvider>
    </>
  )
}
