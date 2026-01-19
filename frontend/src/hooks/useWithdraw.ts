import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MilestoneCampaignABI } from '@/lib/contracts/abis';
import { Address } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useWithdraw(campaignAddress: Address) {
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      toast.success('Transaction Sent!', {
        description: 'Withdrawing available funds...',
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank'),
        },
      });
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Withdrawal Successful!', {
        description: 'Funds have been transferred to your wallet.',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError) {
      const message = (writeError as any).shortMessage || writeError.message;
      toast.error('Withdrawal Failed', {
        description: message,
      });
    }
  }, [writeError]);

  const withdraw = async () => {
    try {
      writeContract({
        address: campaignAddress,
        abi: MilestoneCampaignABI,
        functionName: 'withdraw',
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Failed to initiate transaction');
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
