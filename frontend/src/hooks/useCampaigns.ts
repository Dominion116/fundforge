import { useReadContract, useReadContracts } from 'wagmi';
import { CampaignFactoryABI, MilestoneCampaignABI } from '@/lib/contracts/abis';
import { addresses, DEFAULT_CHAIN_ID } from '@/lib/contracts/addresses';
import { Address } from 'viem';

export interface CampaignData {
  address: Address;
  creator: Address;
  title: string;
  description: string;
  goal: bigint;
  deadline: bigint;
  totalContributed: bigint;
  state: number; // enum
}

interface CampaignInfo {
  creator: Address;
  title: string;
  description: string;
  goal: bigint;
  deadline: bigint;
  totalContributed: bigint;
  state: number;
}

export function useCampaigns() {
  // 1. Fetch all campaign addresses from the Factory
  const { data: campaignAddresses, isLoading: isLoadingAddresses } = useReadContract({
    address: addresses[DEFAULT_CHAIN_ID].CampaignFactory as Address,
    abi: CampaignFactoryABI,
    functionName: 'getAllCampaigns',
    chainId: DEFAULT_CHAIN_ID,
  });

  // 2. Prepare contract calls for each campaign address
  const contracts = campaignAddresses?.map((address) => ({
    address,
    abi: MilestoneCampaignABI,
    functionName: 'getCampaignInfo',
    chainId: DEFAULT_CHAIN_ID,
  })) || [];

  // 3. Fetch campaign details in parallel using multicall
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useReadContracts({
    contracts,
    query: {
      enabled: !!campaignAddresses && campaignAddresses.length > 0,
    }
  });

  // 4. Transform data
  const campaigns: CampaignData[] = campaignsData
    ? campaignsData.map((result, index) => {
        if (result.status === 'success' && campaignAddresses) {
          const info = result.result as CampaignInfo;
          return {
            address: campaignAddresses[index],
            creator: info.creator,
            title: info.title,
            description: info.description,
            goal: info.goal,
            deadline: info.deadline,
            totalContributed: info.totalContributed,
            state: info.state,
          };
        }
        return null;
      }).filter((c): c is CampaignData => c !== null)
    : [];

  return {
    campaigns,
    isLoading: isLoadingAddresses || isLoadingCampaigns,
  };
}
