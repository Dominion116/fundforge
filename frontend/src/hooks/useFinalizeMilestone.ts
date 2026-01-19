import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useFinalizeMilestone(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      toast.success('Transaction Sent!', {
        description: 'Finalizing milestone voting...',
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank'),
        },
      });
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Voting Finalized!', {
        description: 'The milestone state has been updated based on the votes.',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError) {
      const message = (writeError as any).shortMessage || writeError.message;
      toast.error('Transaction Failed', {
        description: message,
      });
    }
  }, [writeError]);

  const finalizeMilestone = async (milestoneId: number) => {
    try {
      writeContract({
        address: campaignAddress,
        abi: MilestoneCampaignABI,
        functionName: 'finalizeMilestoneVoting',
        args: [BigInt(milestoneId)],
      });
    } catch (error) {
      console.error('Finalization error:', error);
      toast.error('Failed to initiate transaction');
    }
  };

  return {
    finalizeMilestone,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError
  };
}
