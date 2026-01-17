'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { DEFAULT_CHAIN_ID } from '@/lib/contracts/addresses';

export interface Milestone {
  description: string;
  amount: bigint;
  votingDeadline: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  state: number;
}

export interface CampaignInfo {
  creator: Address;
  title: string;
  description: string;
  goal: bigint;
  deadline: bigint;
  totalContributed: bigint;
  state: number;
}

export function useCampaignDetails(campaignAddress: Address) {
  // 1. Fetch Basic Info
  const { data: rawCampaignInfo, isLoading: isLoadingInfo } = useReadContract({
    address: campaignAddress,
    abi: MilestoneCampaignABI,
    functionName: 'getCampaignInfo',
    chainId: DEFAULT_CHAIN_ID,
  });

  const campaign = rawCampaignInfo ? rawCampaignInfo as CampaignInfo : null;

  // 2. Fetch Milestone Count
  const { data: milestoneCount } = useReadContract({
    address: campaignAddress,
    abi: MilestoneCampaignABI,
    functionName: 'getMilestoneCount',
    chainId: DEFAULT_CHAIN_ID,
  });

  // 3. Fetch all Milestones
  const milestoneCalls = Array.from({ length: milestoneCount ? Number(milestoneCount) : 0 }).map((_, i) => ({
    address: campaignAddress,
    abi: MilestoneCampaignABI,
    functionName: 'getMilestoneInfo',
    args: [BigInt(i)],
    chainId: DEFAULT_CHAIN_ID,
  }));

  const { data: milestonesData, isLoading: isLoadingMilestones } = useReadContracts({
    contracts: milestoneCalls,
    query: {
      enabled: !!milestoneCount,
    }
  });

  const milestones: Milestone[] = milestonesData
    ? milestonesData.map((result) => {
        if (result.status === 'success') {
            const m = result.result as any;
            return {
                description: m.description,
                amount: m.amount,
                votingDeadline: m.votingDeadline,
                votesFor: m.votesFor,
                votesAgainst: m.votesAgainst,
                state: m.state
            } as Milestone;
        }
        return null;
    }).filter((m): m is Milestone => m !== null)
    : [];

  return {
    campaign,
    milestones,
    isLoading: isLoadingInfo || isLoadingMilestones,
  };
}
