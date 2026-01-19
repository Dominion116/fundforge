import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CampaignFactoryABI } from '@/lib/contracts/abis';
import { addresses, DEFAULT_CHAIN_ID } from '@/lib/contracts/addresses';
import { Address } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useCreateCampaign() {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      toast.success('Transaction Sent!', {
        description: 'Creating your campaign...',
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank'),
        },
      });
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Campaign Created!', {
        description: 'Your project is now live on the blockchain.',
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

  const createCampaign = async (
    title: string,
    description: string,
    goal: bigint,
    duration: bigint, // in seconds
    milestoneDescriptions: string[],
    milestoneAmounts: bigint[]
  ) => {
    try {
      writeContract({
        address: addresses[DEFAULT_CHAIN_ID].CampaignFactory as Address,
        abi: CampaignFactoryABI,
        functionName: 'createMilestoneCampaign',
        args: [
          title,
          description,
          goal,
          duration,
          milestoneDescriptions,
          milestoneAmounts
        ],
        chainId: DEFAULT_CHAIN_ID,
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to initiate transaction');
    }
  };

  return {
    createCampaign,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError
  };
}
