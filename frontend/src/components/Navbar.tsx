'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-10 rounded-none bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-foreground">
            FundForge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#campaigns" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
        </div>

        <div className="flex items-center gap-4">
          <ConnectWalletButton className="text-sm" />
        </div>
      </div>
    </motion.nav>
  )
}
