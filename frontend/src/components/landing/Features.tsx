'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Lock, Users, BarChart3, Fingerprint, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    title: 'Milestone-Based Funding',
    description: 'Funds are released in stages only after contributors vote to approve completed milestones.',
    icon: CheckCircle2
  },
  {
    title: 'Contributor Governance',
    description: 'Every backer has a voice. Voting power is proportional to your contribution.',
    icon: Users
  },
  {
    title: 'Secure Smart Contracts',
    description: 'Built with industry-leading security patterns. Non-custodial and transparent.',
    icon: Lock
  },
  {
    title: 'Real-time Analytics',
    description: 'Track campaign progress, funding velocity, and milestone status in real-time.',
    icon: BarChart3
  },
  {
    title: 'Low Resistance Entry',
    description: 'Connect any wallet via Reown and start funding or creating in seconds.',
    icon: Fingerprint
  },
  {
    title: 'Automatic Refunds',
    description: 'If a campaign fails to meet its deadline or target, 100% of funds are returned.',
    icon: ShieldAlert
  }
]

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <div className="mb-6 flex justify-center">
            <Badge variant="secondary" className="rounded-none py-1 border-border">
              ✦ Platform Features
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter mb-6">
            Why Choose FundForge?
          </h2>
          <p className="mt-4 text-sm text-foreground/80 max-w-2xl mx-auto">
            We've reimagined crowdfunding to put control and trust back into the hands of contributors through milestone-based verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/5 border-white/10 hover:border-primary/50 transition-colors group overflow-hidden relative rounded-none">
                <CardHeader>
                  <div className="size-12 rounded-none bg-primary flex items-center justify-center mb-6">
                    <feature.icon className="size-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-foreground/70 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
