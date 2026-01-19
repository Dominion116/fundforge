import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useContribute(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      toast.success('Transaction Sent!', {
        description: 'Processing your contribution...',
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank'),
        },
      });
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Contribution Successful!', {
        description: 'Thank you for supporting this project!',
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
      toast.error('Failed to initiate transaction');
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
