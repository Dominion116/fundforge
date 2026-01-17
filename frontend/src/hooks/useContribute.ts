'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';

export function useContribute(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const contribute = async (amountWei: bigint) => {
    try {
      writeContract({
        address: campaignAddress,
        abi: MilestoneCampaignABI,
        functionName: 'contribute',
        value: amountWei,
      });
    } catch (error) {
      console.error('Contribution error:', error);
      toast.error('Failed to contribute');
    }
  };

  return {
    contribute,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError
  };
}
