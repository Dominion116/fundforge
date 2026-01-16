'use client'

import { motion } from 'framer-motion'
import { Wallet, PlusCircle, Vote, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <div className="mb-6 flex justify-center">
            <Badge variant="secondary" className="rounded-none py-1 border-border">
              ✦ Step-by-Step
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter mb-6">
            How It Works
          </h2>
          <p className="mt-4 text-sm text-foreground/80 max-w-2xl mx-auto">
            Participating in the future of crowdfunding is simpler than ever with our transparent milestone system.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center relative">
          {steps.map((step, i) => (
            <div key={i} className="contents md:flex hover:bg-none">
              {/* Step Item */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center flex-1 max-w-sm mx-auto md:mx-0"
              >
                {/* Icon Container */}
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                  <div className="size-16 rounded-2xl bg-background border border-border flex items-center justify-center relative z-10 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-primary/25">
                    <step.icon className="size-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold tracking-tight mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  {step.description}
                </p>
              </motion.div>

              {/* Connector (Desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex flex-col justify-center items-center flex-none w-16 lg:w-32 pt-8 px-2 opacity-30">
                  <div className="w-full h-px border-t-2 border-dashed border-foreground/30 relative">
                     <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
                       <ArrowRight className="size-4 text-foreground/50" />
                     </div>
                  </div>
                </div>
              )}

              {/* Connector (Mobile) */}
              {i < steps.length - 1 && (
                 <div className="md:hidden flex justify-center py-8 opacity-30">
                    <div className="h-12 w-px border-l-2 border-dashed border-foreground/30 relative">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                         <div className="size-2 bg-foreground/50 rounded-full" />
                      </div>
                    </div>
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
