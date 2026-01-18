'use client';

import { useAccount } from 'wagmi';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { CampaignCard } from '@/components/campaign/CampaignCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wallet, TrendingUp, Users, Vote, Plus, ArrowRight } from 'lucide-react';
import { formatEther } from 'viem';
import Link from 'next/link';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { 
    createdCampaigns, 
    backedCampaigns, 
    totalContributed, 
    totalCampaignsCreated,
    totalCampaignsBacked,
    isLoading 
  } = useUserDashboard();

  // Not connected state
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="size-20 mx-auto bg-primary/10 flex items-center justify-center border border-primary/20">
            <Wallet className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter">Connect Your Wallet</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect your wallet to view your dashboard, track your campaigns, and manage your contributions.
          </p>
          <ConnectWalletButton size="lg" className="px-8 text-base rounded-none" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="space-y-4 sm:space-y-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-2">
              Your Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your campaigns and track your contributions
            </p>
          </div>
          <Button asChild className="rounded-none w-full sm:w-auto" size="lg">
            <Link href="/create">
              <Plus className="mr-2 size-4" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Wallet Info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Wallet className="size-4 shrink-0" />
          <span className="font-mono truncate">{address}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader className="p-4 sm:p-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Created</CardTitle>
              <TrendingUp className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tighter">{totalCampaignsCreated}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader className="p-4 sm:p-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Backed</CardTitle>
              <Users className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tighter">{totalCampaignsBacked}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader className="p-4 sm:p-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributed</CardTitle>
              <Wallet className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tighter">{formatEther(totalContributed)} ETH</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader className="p-4 sm:p-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Votes Cast</CardTitle>
              <Vote className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tighter">0</div>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-12" />

      {/* Created Campaigns Section */}
      <div className="space-y-6 sm:space-y-8 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tighter mb-2">Your Campaigns</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Campaigns you've created and are managing</p>
          </div>
          {createdCampaigns.length > 0 && (
            <Badge variant="outline" className="rounded-none text-xs">
              {createdCampaigns.length} Total
            </Badge>
          )}
        </div>

        {createdCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {createdCampaigns.map((campaign) => (
              <CampaignCard key={campaign.address} campaign={campaign} />
            ))}
          </div>
        ) : (
          <Card className="bg-card/20 border-dashed border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="size-16 bg-muted/50 flex items-center justify-center mb-4">
                <TrendingUp className="size-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Start your first campaign and bring your project to life with milestone-based funding.
              </p>
              <Button asChild className="rounded-none">
                <Link href="/create">
                  <Plus className="mr-2 size-4" />
                  Create Your First Campaign
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="mb-12" />

      {/* Backed Campaigns Section */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tighter mb-2">Backed Campaigns</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Projects you've contributed to</p>
          </div>
          {backedCampaigns.length > 0 && (
            <Badge variant="outline" className="rounded-none text-xs">
              {backedCampaigns.length} Total
            </Badge>
          )}
        </div>

        {totalCampaignsBacked > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {backedCampaigns.slice(0, 6).map((campaign) => (
              <CampaignCard key={campaign.address} campaign={campaign} />
            ))}
          </div>
        ) : (
          <Card className="bg-card/20 border-dashed border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="size-16 bg-muted/50 flex items-center justify-center mb-4">
                <Users className="size-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No contributions yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Explore active campaigns and support projects that align with your interests.
              </p>
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/explore">
                  Explore Campaigns
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
