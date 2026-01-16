'use client'

import { motion } from 'framer-motion'
import { Wallet, PlusCircle, Vote } from 'lucide-react'

const steps = [
  {
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Securely link your Ethereum wallet using Reown to get started instantly.',
  },
  {
    icon: PlusCircle,
    title: 'Fund or Create',
    description: 'Back existing projects or launch your own with transparent milestones.',
  },
  {
    icon: Vote,
    title: 'Govern Progress',
    description: 'Vote on milestone completion to release funds and ensure project success.',
  }
]

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter mb-6">
            How It Works
          </h2>
          <p className="mt-4 text-base text-foreground/80 max-w-2xl mx-auto">
            Participating in the future of crowdfunding is simpler than ever with our transparent milestone system.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="size-20 rounded-none bg-background border-4 border-primary/20 group-hover:border-primary transition-colors flex items-center justify-center mb-8 shadow-xl shadow-primary/5">
                  <step.icon className="size-8 text-primary" />
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 size-8 rounded-none bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-4">{step.title}</h3>
                <p className="text-base text-foreground/70 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
