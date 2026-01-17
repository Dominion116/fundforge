import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CampaignFactoryABI } from '@/lib/contracts/abis';
import { addresses, DEFAULT_CHAIN_ID } from '@/lib/contracts/addresses';
import { Address } from 'viem';
import { toast } from 'sonner';

export function useCreateCampaign() {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

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
      toast.error('Failed to create campaign');
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
