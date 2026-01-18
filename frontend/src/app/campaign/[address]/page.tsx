'use client';

import { use } from 'react';
import { useCampaignDetails } from '@/hooks/useCampaignDetails';
import { useContribute } from '@/hooks/useContribute';
import { useVote } from '@/hooks/useVote';
import { useSubmitMilestone } from '@/hooks/useSubmitMilestone';
import { useWithdraw } from '@/hooks/useWithdraw';
import { Address, formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Target, Calendar, User, Shield, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CampaignDetailsPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: userAddress } = useAccount();
  const { address } = use(params);
  const campaignAddress = address as Address;
  
  const { campaign, milestones, isLoading } = useCampaignDetails(campaignAddress);
  const { contribute, isPending: isContributing, isConfirming: isConfirmingContribute } = useContribute(campaignAddress);
  const { vote, isPending: isVoting } = useVote(campaignAddress);
  const { submitMilestone, isPending: isSubmittingMilestone } = useSubmitMilestone(campaignAddress);
  const { withdraw, isPending: isWithdrawing } = useWithdraw(campaignAddress);
  
  const [contributionAmount, setContributionAmount] = useState('');

  const isOwner = userAddress?.toLowerCase() === campaign?.creator?.toLowerCase();

  const handleContribute = async () => {
    if (!contributionAmount || isNaN(parseFloat(contributionAmount))) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      await contribute(parseEther(contributionAmount));
      toast.success('Contribution submitted successfully!');
      setContributionAmount('');
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tighter">Campaign Not Found</h1>
        <p className="text-muted-foreground mt-4 text-sm">The campaign address might be incorrect or on a different network.</p>
      </div>
    );
  }

  const progress = campaign.goal > 0n 
    ? Number((campaign.totalContributed * 100n) / campaign.goal) 
    : 0;
  const displayProgress = Math.min(progress, 100);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Campaign Details & Milestones */}
        <div className="lg:col-span-2 space-y-12">
          {/* Campaign Header */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-none py-1 border-border text-xs">
                ✦ Milestone Campaign
              </Badge>
              {campaign.state === 0 && <Badge variant="secondary" className="rounded-none bg-emerald-500/20 text-emerald-500 border-emerald-500/50 text-xs">Active</Badge>}
              {campaign.state === 1 && <Badge variant="secondary" className="rounded-none bg-blue-500/20 text-blue-500 border-blue-500/50 text-xs">Successful</Badge>}
              {campaign.state === 2 && <Badge variant="destructive" className="rounded-none text-xs">Failed</Badge>}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter leading-tight">
              {campaign.title}
            </h1>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {campaign.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="size-4 shrink-0" />
                <span className="truncate">Created by <span className="text-foreground font-mono">{campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                <span>Deadline: <span className="text-foreground">{new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}</span></span>
              </div>
            </div>
          </div>

          {/* Owner Dashboard */}
          {isOwner && (
            <>
              <Separator />
              <Card className="bg-card/40 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                    <Shield className="size-5 text-primary" />
                    Project Owner Dashboard
                  </CardTitle>
                  <CardDescription className="text-sm text-foreground/70">
                    Manage your campaign and submit milestones for contributor verification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => submitMilestone()} 
                    disabled={isSubmittingMilestone || campaign.state !== 0}
                    className="rounded-none"
                  >
                    {isSubmittingMilestone ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle2 className="mr-2 size-4" />}
                    Submit Next Milestone
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => withdraw()} 
                    disabled={isWithdrawing || (campaign.state !== 1 && campaign.state !== 2)}
                    className="rounded-none"
                  >
                    {isWithdrawing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ArrowUpRight className="mr-2 size-4" />}
                    Withdraw Funds
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          <Separator />

          {/* Milestones Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shield className="size-5 sm:size-6 text-primary shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tighter">Project Milestones</h2>
              </div>
              <Badge variant="outline" className="rounded-none text-xs w-fit">
                {milestones.length} Total
              </Badge>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "size-8 shrink-0 flex items-center justify-center border bg-background",
                            milestone.state === 3 ? "border-emerald-500 text-emerald-500" : "border-border text-muted-foreground"
                          )}>
                            {milestone.state === 3 ? <CheckCircle2 className="size-5" /> : <span className="text-sm font-semibold">{index + 1}</span>}
                          </div>
                          <CardTitle className="text-base sm:text-xl font-semibold tracking-tight leading-tight flex-1">{milestone.description}</CardTitle>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-11">
                          {milestone.state === 0 && <Badge variant="outline" className="rounded-none text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>}
                          {milestone.state === 1 && <Badge variant="outline" className="rounded-none text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">Voting Active</Badge>}
                          {milestone.state === 2 && <Badge variant="outline" className="rounded-none text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Approved</Badge>}
                          {milestone.state === 3 && <Badge variant="outline" className="rounded-none text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Completed</Badge>}
                          {milestone.state === 4 && <Badge variant="outline" className="rounded-none text-xs bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-secondary/50 border border-border text-sm font-semibold w-fit">
                        {formatEther(milestone.amount)} ETH
                      </div>
                    </div>
                  </CardHeader>
                  
                  {milestone.state === 1 && (
                    <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="p-3 sm:p-4 bg-primary/5 border border-primary/10 space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs font-medium">
                          <span className="text-primary">VOTING IN PROGRESS</span>
                          <span className="text-muted-foreground">Ends: {new Date(Number(milestone.votingDeadline) * 1000).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">For</span>
                              <span className="font-semibold">{formatEther(milestone.votesFor)} ETH</span>
                            </div>
                            <Progress 
                              value={milestone.votesFor > 0n || milestone.votesAgainst > 0n ? Number((milestone.votesFor * 100n) / (milestone.votesFor + milestone.votesAgainst)) : 0} 
                              className="h-1.5" 
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Against</span>
                              <span className="font-semibold">{formatEther(milestone.votesAgainst)} ETH</span>
                            </div>
                            <Progress 
                              value={milestone.votesFor > 0n || milestone.votesAgainst > 0n ? Number((milestone.votesAgainst * 100n) / (milestone.votesFor + milestone.votesAgainst)) : 0} 
                              className="h-1.5" 
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => vote(index, true)}
                            disabled={isVoting}
                            className="flex-1 rounded-none bg-emerald-500 hover:bg-emerald-600 text-white w-full"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={isVoting}
                            onClick={() => vote(index, false)}
                            className="flex-1 rounded-none border-destructive/30 hover:bg-destructive/10 text-destructive w-full"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Funding Widget */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-24 bg-card/40 backdrop-blur-sm border-border/50">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight">Back This Project</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-foreground/70">
                Support this campaign to unlock milestones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              {/* Funding Progress */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-end gap-4">
                  <div className="space-y-0.5">
                    <span className="text-2xl sm:text-3xl font-semibold tracking-tighter block">{formatEther(campaign.totalContributed)} ETH</span>
                    <p className="text-xs text-muted-foreground">raised</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-semibold text-muted-foreground block">{formatEther(campaign.goal)} ETH</span>
                    <p className="text-xs text-muted-foreground">goal</p>
                  </div>
                </div>
                <Progress value={displayProgress} className="h-2" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs">
                  <Badge variant="outline" className="rounded-none w-fit">{progress}% funded</Badge>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Target className="size-3 shrink-0" />
                    <span className="truncate">{formatEther(campaign.goal - campaign.totalContributed < 0n ? 0n : campaign.goal - campaign.totalContributed)} ETH to go</span>
                  </span>
                </div>
              </div>

              <Separator />

              {/* Contribution Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs sm:text-sm font-medium">Contribution Amount (ETH)</Label>
                  <div className="relative">
                    <Input 
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.1"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="pl-8 bg-background/50 text-base"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">Ξ</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full rounded-none py-5 sm:py-6 text-sm sm:text-base font-semibold" 
                  onClick={handleContribute}
                  disabled={isContributing || isConfirmingContribute || campaign.state !== 0}
                >
                  {isContributing || isConfirmingContribute ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : campaign.state !== 0 ? (
                    'Campaign Ended'
                  ) : (
                    'Contribute Now'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Funds are held in escrow and released only when milestones are approved by contributors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
