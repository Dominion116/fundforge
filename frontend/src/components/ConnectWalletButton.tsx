'use client'

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConnectWalletButtonProps {
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showBalance?: boolean
}

export const ConnectWalletButton = ({ 
  className, 
  size = 'default',
}: ConnectWalletButtonProps) => {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <Button 
      onClick={() => open()} 
      variant={isConnected ? "outline" : "default"}
      size={size}
      className={cn("rounded-none font-mono", className)}
    >
      <Wallet className="mr-2 size-4" />
      {isConnected ? truncatedAddress : "Connect Wallet"}
    </Button>
  )
}
