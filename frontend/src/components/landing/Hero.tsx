'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">


      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-none bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            The Future of Crowdfunding
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Forge Your Vision with <br />
            <span className="text-primary">Absolute Trust</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            FundForge is the first decentralized crowdfunding platform powered by 
            milestone-based governance. Secure your contributions and ensure 
            accountability through smart contracts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-none group">
              Start a Campaign
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <ConnectWalletButton size="lg" className="h-14 px-8 text-lg" />
          </div>
        </motion.div>

        {/* Stats / Trust badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { icon: Shield, label: 'Secured by Web3', color: 'indigo' },
            { icon: Zap, label: 'Instant Payouts', color: 'purple' },
            { icon: Globe, label: 'Global Access', color: 'pink' },
            { icon: ArrowRight, label: 'Milestone Voting', color: 'blue' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                <item.icon className="size-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
