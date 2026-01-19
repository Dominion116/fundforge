import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useVote(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      toast.success('Transaction Sent!', {
        description: 'Submitting your vote...',
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank'),
        },
      });
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Vote Submitted!', {
        description: 'Your voice has been recorded on the blockchain.',
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
      toast.error('Failed to initiate transaction');
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
