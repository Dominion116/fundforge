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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Target, Calendar, User, Shield, CheckCircle2, Circle, ArrowUpRight, VotingIcon, Lock } from 'lucide-react';
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
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground animate-pulse font-medium">Synchronizing with blockchain...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Campaign Not Found</h1>
        <p className="text-muted-foreground mt-2">The campaign might be on a different network or the address is invalid.</p>
      </div>
    );
  }

  const progress = campaign.goal > 0n 
    ? Number((campaign.totalContributed * 100n) / campaign.goal) 
    : 0;
  const displayProgress = Math.min(progress, 100);

  return (
    <div className="container mx-auto px-6 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details & Milestones */}
        <div className="lg:col-span-2 space-y-12">
          {/* Header Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="rounded-none bg-primary/10 text-primary border-primary/20 py-1">
                ✦ MILESTONE PROTOCOL
              </Badge>
              {campaign.state === 0 && <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">ACTIVE</Badge>}
              {campaign.state === 1 && <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/5">COMPLETED</Badge>}
              {campaign.state === 2 && <Badge variant="destructive">FAILED</Badge>}
            </div>
            
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight drop-shadow-sm">
                    {campaign.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-light">
                    {campaign.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-secondary/40 px-4 py-2 rounded-full border border-border/50 shadow-sm">
                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    <User className="size-3 text-primary" />
                </div>
                <span className="text-sm font-medium">
                    Owner: <span className="text-foreground font-mono">{campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/40 px-4 py-2 rounded-full border border-border/50 shadow-sm">
                <Calendar className="size-4 text-primary" />
                <span className="text-sm font-medium">
                    Ends: <span className="text-foreground">{new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Owner Dashboard Snippet */}
          {isOwner && (
            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="size-16" />
                </div>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="size-4" />
                        Project Owner Dashboard
                    </CardTitle>
                    <CardDescription>Manage your campaign and submit milestones for verification.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => submitMilestone()} 
                        disabled={isSubmittingMilestone || campaign.state !== 0}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {isSubmittingMilestone ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle2 className="mr-2 size-4" />}
                        Submit Next Milestone
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => withdraw()} 
                        disabled={isWithdrawing || (campaign.state !== 1 && campaign.state !== 2)}
                    >
                        {isWithdrawing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ArrowUpRight className="mr-2 size-4" />}
                        Withdraw Available Funds
                    </Button>
                </CardContent>
            </Card>
          )}

          {/* Milestone Timeline */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="size-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Trust Map</h2>
                        <p className="text-sm text-muted-foreground font-medium">Escrow Release Schedule</p>
                    </div>
                </div>
                <Badge variant="outline" className="px-3 py-1 bg-secondary/30">
                    {milestones.length} STAGES
                </Badge>
            </div>
            
            <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-gradient-to-b before:from-primary/60 before:via-border/40 before:to-transparent">
                {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-14 pb-14 last:pb-0 group">
                        <div className={cn(
                            "absolute left-0 top-0 size-10 rounded-full border-2 bg-background flex items-center justify-center z-10 transition-all duration-500",
                            milestone.state === 3 
                                ? "border-emerald-500 text-emerald-500 bg-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                                : milestone.state === 1 
                                    ? "border-blue-500 text-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse"
                                    : "border-border text-muted-foreground grayscale group-hover:grayscale-0"
                        )}>
                            {milestone.state === 3 ? <CheckCircle2 className="size-6" /> : (
                                <span className="text-sm font-black">{index + 1}</span>
                            )}
                        </div>
                        <Card className={cn(
                            "bg-card/30 border-border/50 backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300",
                            milestone.state === 1 && "border-blue-500/30 bg-blue-500/[0.02]"
                        )}>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl font-bold tracking-tight">{milestone.description}</CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            {milestone.state === 0 && <Badge variant="outline" className="text-[10px] h-5 bg-secondary text-muted-foreground border-transparent uppercase tracking-widest px-2">Pending</Badge>}
                                            {milestone.state === 1 && <Badge variant="outline" className="text-[10px] h-5 bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase tracking-widest px-2">Verification Active</Badge>}
                                            {milestone.state === 2 && <Badge variant="outline" className="text-[10px] h-5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase tracking-widest px-2">Approved</Badge>}
                                            {milestone.state === 3 && <Badge variant="outline" className="text-[10px] h-5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase tracking-widest px-2 font-bold italic">Completed ✓</Badge>}
                                            {milestone.state === 4 && <Badge variant="outline" className="text-[10px] h-5 bg-destructive/10 text-destructive border-destructive/20 uppercase tracking-widest px-2">Rejected</Badge>}
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-lg bg-secondary/60 border border-border/80 text-base font-bold text-foreground/90 tabular-nums">
                                        {formatEther(milestone.amount)} ETH
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {milestone.state === 1 && (
                                    <div className="mt-4 p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                            <span className="text-blue-500 flex items-center gap-1.5">
                                                <Target className="size-3.5" />
                                                GOVERNANCE VOTE OPEN
                                            </span>
                                            <span className="text-muted-foreground/80">ENDS: {new Date(Number(milestone.votingDeadline) * 1000).toLocaleString()}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button 
                                                size="lg" 
                                                onClick={() => vote(index, true)}
                                                disabled={isVoting}
                                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-none shadow-lg shadow-emerald-500/20"
                                            >
                                                APPROVE
                                            </Button>
                                            <Button 
                                                size="lg" 
                                                variant="outline"
                                                disabled={isVoting}
                                                onClick={() => vote(index, false)}
                                                className="flex-1 border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive font-bold"
                                            >
                                                REJECT
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-center">
                                            <div className="space-y-1">
                                                <p className="text-emerald-500/70">FOR: {formatEther(milestone.votesFor)} ETH</p>
                                                <Progress value={milestone.votesFor > 0n || milestone.votesAgainst > 0n ? Number((milestone.votesFor * 100n) / (milestone.votesFor + milestone.votesAgainst)) : 0} className="h-1 bg-emerald-500/10" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-destructive/70">AGAINST: {formatEther(milestone.votesAgainst)} ETH</p>
                                                <Progress value={milestone.votesFor > 0n || milestone.votesAgainst > 0n ? Number((milestone.votesAgainst * 100n) / (milestone.votesFor + milestone.votesAgainst)) : 0} className="h-1 bg-destructive/10" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Funding Widget */}
        <div className="space-y-6">
          <Card className="sticky top-24 bg-card/60 border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-xl overflow-hidden rounded-2xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-black tracking-tight">Support Growth</CardTitle>
                <CardDescription className="text-sm font-medium">Contribute to unlock the project's next phase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-5">
                    <div className="flex justify-between items-end px-1">
                        <div className="space-y-1">
                            <span className="text-4xl font-black tracking-tighter tabular-nums">{formatEther(campaign.totalContributed)}</span>
                            <span className="text-lg font-bold ml-1 text-primary">ETH</span>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CURRENTLY RAISED</p>
                        </div>
                        <div className="text-right space-y-1">
                            <span className="text-xl font-bold text-muted-foreground tabular-nums">{formatEther(campaign.goal)}</span>
                            <span className="text-sm font-bold ml-0.5 text-muted-foreground/60">ETH</span>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">MIN GOAL</p>
                        </div>
                    </div>
                    <Progress value={displayProgress} className="h-4 bg-primary/5 rounded-full overflow-hidden" />
                    <div className="flex justify-between items-center">
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 rounded-md">
                            {progress}% FUNDED
                        </Badge>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-tight">
                            <Target className="size-4 text-primary/60" />
                            {formatEther(campaign.goal - campaign.totalContributed < 0n ? 0n : campaign.goal - campaign.totalContributed)} ETH TO TARGET
                        </span>
                    </div>
                </div>

                <div className="space-y-5 pt-4">
                    <div className="space-y-3">
                        <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Contribution Input</Label>
                        <div className="relative group">
                            <Input 
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.25"
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(e.target.value)}
                                className="pl-12 bg-background/40 border-border/80 group-hover:border-primary/50 transition-all py-7 text-2xl font-black tabular-nums rounded-xl focus:ring-primary/20"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xl">Ξ</span>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/50">
                            <Shield className="size-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                Your funds are protected. Release is conditional on milestone approval from the DAO of contributors.
                            </p>
                        </div>
                    </div>
                    
                    <Button 
                        size="xl"
                        className="w-full py-8 text-xl font-black tracking-wider rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all uppercase group" 
                        onClick={handleContribute}
                        disabled={isContributing || isConfirmingContribute || campaign.state !== 0}
                    >
                        {isContributing || isConfirmingContribute ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="size-6 animate-spin" />
                                <span>VERIFYING...</span>
                            </div>
                        ) : campaign.state !== 0 ? (
                            'FUNDING ARCHIVED'
                        ) : (
                            <div className="flex items-center gap-2">
                                BACK THIS CAMPAIGN
                                <ArrowUpRight className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        )}
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="bg-primary/[0.03] border-t border-primary/5 py-5">
                <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mx-auto opacity-70">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    DECENTRALIZED ESCROW VERIFIED
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
