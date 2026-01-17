'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';

export function useSubmitMilestone(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitMilestone = async () => {
    try {
      writeContract({
        address: campaignAddress,
        abi: MilestoneCampaignABI,
        functionName: 'submitMilestone',
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit milestone');
    }
  };

  return {
    submitMilestone,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError
  };
}
