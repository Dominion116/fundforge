'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';

export function useWithdraw(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = async () => {
    try {
      writeContract({
        address: campaignAddress,
        abi: MilestoneCampaignABI,
        functionName: 'withdraw',
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Failed to withdraw funds');
    }
  };

  return {
    withdraw,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError
  };
}
