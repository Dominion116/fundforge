'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, Target } from 'lucide-react'

const campaigns = [
  {
    title: 'Eco-Smart Home System',
    creator: '0x1234...5678',
    description: 'An open-source smart home system focused on extreme energy efficiency.',
    target: '50 ETH',
    raised: '42.5 ETH',
    progress: 85,
    contributors: 124,
    daysLeft: 5,
    category: 'Hardware'
  },
  {
    title: 'DeFi Education Platform',
    creator: '0x8765...4321',
    description: 'Bringing institutional-grade DeFi education to the masses with gamified learning.',
    target: '20 ETH',
    raised: '15 ETH',
    progress: 75,
    contributors: 89,
    daysLeft: 12,
    category: 'Education'
  },
  {
    title: 'Organic AI Art Studio',
    creator: '0xabcd...efgh',
    description: 'A physical art studio integrating AI-generated concepts with traditional fine art.',
    target: '15 ETH',
    raised: '3 ETH',
    progress: 20,
    contributors: 45,
    daysLeft: 22,
    category: 'Art'
  }
]

export const CampaignsPreview = () => {
  return (
    <section id="campaigns" className="py-32 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter mb-6">
              Live Campaigns
            </h2>
            <p className="mt-4 text-base text-foreground/80 max-w-xl">
              Be the first to back these revolutionary projects and participate in their development cycle.
            </p>
          </div>
          <Button variant="outline" size="lg" className="rounded-none text-base px-8">
            View All Campaigns
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="flex flex-col h-full bg-card/40 border-white/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden group">
                <div className="h-48 bg-muted/20 relative">
                  {/* Image placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/10 font-bold text-4xl">
                     {item.category.toUpperCase()}
                  </div>
                  <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/20 backdrop-blur-md">
                    {item.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors line-clamp-1">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">by {item.creator}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{item.raised}</span>
                      <span className="text-muted-foreground">raised of {item.target}</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Users className="size-3" />
                        {item.contributors} backers
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {item.daysLeft}d left
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button className="w-full rounded-none py-6" variant="secondary">
                    Fund Project
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
