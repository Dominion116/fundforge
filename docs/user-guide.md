# FundForge User Guide

## For Campaign Creators
1. **Create a Campaign**: Call `createCampaign` on the `CampaignFactory` with your title, description, goal (in wei), and duration (in seconds).
2. **Monitor Progress**: Use your campaign's address to check `totalContributed`.
3. **Withdraw Funds**: Once the deadline has passed and the goal is met, call `withdraw()` to receive the funds.

## For Contributors
1. **Find a Campaign**: Browse all campaigns via `CampaignFactory.getAllCampaigns()`.
2. **Contribute**: Send ETH to the campaign address or call `contribute()`.
3. **Get Refund**: If the campaign fails (deadline passed and goal not met), call `getRefund()` on the campaign contract to get your ETH back.

## Technical Details
- Goal is in Wei (1 ETH = 10^18 Wei).
- Duration is in seconds (e.g., 3600 for 1 hour).
