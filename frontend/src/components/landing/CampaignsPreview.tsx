'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus } from 'lucide-react'
import { useCampaigns } from '@/hooks/useCampaigns'
import { CampaignCard } from '@/components/campaign/CampaignCard'
import Link from 'next/link'

export const CampaignsPreview = () => {
  const { campaigns, isLoading } = useCampaigns();

  // Show only top 3 active or current campaigns
  const displayCampaigns = campaigns.slice(0, 3);

  return (
    <section id="campaigns" className="py-20 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="mb-6 flex justify-center">
          <Badge variant="secondary" className="rounded-none py-1 border-border">
            ✦ Explore Opportunities
          </Badge>
        </div>
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter mb-6">
              Live Campaigns
            </h2>
            <p className="mt-4 text-base text-foreground/80 max-w-xl">
              Be the first to back these revolutionary projects and participate in their development cycle through milestone-based verification.
            </p>
          </div>
          <Button variant="outline" size="lg" className="rounded-none text-base px-8" asChild>
            <Link href="/explore">
              View All Campaigns
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="mt-4 text-muted-foreground animate-pulse">Fetching live project data...</p>
          </div>
        ) : displayCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCampaigns.map((campaign, i) => (
              <motion.div
                key={campaign.address}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <CampaignCard campaign={campaign} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border/50 bg-card/10">
            <h3 className="text-xl font-semibold mb-2">No active campaigns yet</h3>
            <p className="text-muted-foreground mb-8">Be the first to create one and lead the way!</p>
            <Button asChild className="rounded-none px-8">
              <Link href="/create">
                <Plus className="mr-2 size-4" />
                Start a Campaign
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
