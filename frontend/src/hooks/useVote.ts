'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';

export function useVote(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const vote = async (milestoneId: number, support: boolean) => {
    try {
      writeContract({
        address: campaignAddress,
        abi: MilestoneCampaignABI,
        functionName: 'voteOnMilestone',
        args: [BigInt(milestoneId), support],
      });
    } catch (error) {
      console.error('Voting error:', error);
      toast.error('Failed to submit vote');
    }
  };

  return {
    vote,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError
  };
}
