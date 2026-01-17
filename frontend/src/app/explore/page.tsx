'use client';

import { useCampaigns } from '@/hooks/useCampaigns';
import { CampaignCard } from '@/components/campaign/CampaignCard';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ExplorePage() {
  const { campaigns, isLoading } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Explore Campaigns</h1>
          <p className="text-muted-foreground max-w-xl">
            Discover and fund groundbreaking projects built by the community. 
            Back projects with confidence using milestone-based funding.
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
                placeholder="Search projects..." 
                className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="mt-4 text-muted-foreground animate-pulse">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.address} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg border-dashed border-border/50 bg-card/20">
           <div className="size-16 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Search className="size-8 text-muted-foreground/50" />
           </div>
          <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {searchQuery 
                ? `No results found for "${searchQuery}". Try a different search term.` 
                : "There are no active campaigns at the moment. Be the first to launch one!"}
          </p>
        </div>
      )}
    </div>
  );
}
