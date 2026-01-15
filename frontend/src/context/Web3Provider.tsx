'use client'

import { WagmiProvider, type Config } from 'wagmi'
import { mainnet, base, baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import React, { type ReactNode } from 'react'

// 1. Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'b51cf8fb882963309a4d87edef2c9383' 

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 2. Create networks
export const networks = [mainnet, base, baseSepolia]

// 3. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 4. Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'FundForge',
    description: 'Decentralized Crowdfunding Platform',
    url: 'http://localhost:3000', // Update for production
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: true
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(180, 77.1144%, 60.5882%)',
    '--w3m-border-radius-master': '0px',
    '--w3m-font-family': 'Source Code Pro, monospace',
    '--w3m-color-mix': 'hsl(180, 77.1144%, 60.5882%)',
    '--w3m-color-mix-strength': 15,
  }
})

// 5. Create Query Client
const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
