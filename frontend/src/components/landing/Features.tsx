'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Lock, Users, BarChart3, Fingerprint, ShieldAlert } from 'lucide-react'

const features = [
  {
    title: 'Milestone-Based Funding',
    description: 'Funds are released in stages only after contributors vote to approve completed milestones.',
    icon: CheckCircle2,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Contributor Governance',
    description: 'Every backer has a voice. Voting power is proportional to your contribution.',
    icon: Users,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'Secure Smart Contracts',
    description: 'Built with industry-leading security patterns. Non-custodial and transparent.',
    icon: Lock,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Real-time Analytics',
    description: 'Track campaign progress, funding velocity, and milestone status in real-time.',
    icon: BarChart3,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Low Resistance Entry',
    description: 'Connect any wallet via Reown and start funding or creating in seconds.',
    icon: Fingerprint,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    title: 'Automatic Refunds',
    description: 'If a campaign fails to meet its deadline or target, 100% of funds are returned.',
    icon: ShieldAlert,
    gradient: 'from-yellow-500 to-amber-500'
  }
]

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose FundForge?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've reimagined crowdfunding to put control and trust back into the hands of contributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/5 border-white/10 hover:border-primary/50 transition-colors group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity`} />
                <CardHeader>
                  <div className={`size-12 rounded-none bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
                    <feature.icon className="size-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
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
