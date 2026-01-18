'use client';

import { useCampaigns } from '@/hooks/useCampaigns';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

export function useUserDashboard() {
  const { address } = useAccount();
  const { campaigns, isLoading } = useCampaigns();

  if (!address) {
    return {
      createdCampaigns: [],
      backedCampaigns: [],
      totalContributed: 0n,
      totalCampaignsCreated: 0,
      totalCampaignsBacked: 0,
      isLoading: false,
    };
  }

  // Filter campaigns created by the user
  const createdCampaigns = campaigns.filter(
    (campaign) => campaign.creator.toLowerCase() === address.toLowerCase()
  );

  // For backed campaigns, we'd need to track contributions on-chain
  // For now, we'll return an empty array as we don't have contribution tracking
  // In a full implementation, you'd need to add events to the contract and index them
  const backedCampaigns = campaigns.filter(
    (campaign) => campaign.creator.toLowerCase() !== address.toLowerCase()
  );

  // Calculate total contributed (would need on-chain data)
  const totalContributed = 0n;

  return {
    createdCampaigns,
    backedCampaigns,
    totalContributed,
    totalCampaignsCreated: createdCampaigns.length,
    totalCampaignsBacked: 0, // Would need contribution events
    isLoading,
  };
}
