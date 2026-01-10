# FundForge Architecture

## Overview
FundForge is a decentralized crowdfunding platform built on Ethereum using Foundry. It allows users to create campaigns with a specific goal and deadline.

## Core Components

### 1. CampaignFactory
- Responsibility: Deploying new `Campaign` contracts and tracking them.
- Functions: `createCampaign`, `getAllCampaigns`, `getCreatorCampaigns`.

### 2. Campaign
- Responsibility: Managing individual campaign states, contributions, withdrawals, and refunds.
- Interface: `ICampaign`.
- Key Logic:
  - `contribute()`: Accepts ETH contributions while active.
  - `withdraw()`: Allows creator to claim funds if goal is met after deadline.
  - `getRefund()`: Allows contributors to reclaim funds if goal is not met after deadline.

### 3. CampaignLib
- Responsibility: Utility functions and error definitions to reduce code duplication and gas costs.

## State Machine
A campaign can be in one of the following states:
- **Active**: Accepting contributions.
- **Successful**: Goal reached and funds withdrawn by creator.
- **Failed**: Goal not reached after deadline, refunds available.
- **Cancelled**: (Optional/Future implementation).

## Security
- **ReentrancyGuard**: Used on all state-changing functions that involve external transfers.
- **Pull over Push**: Contributors must pull their refunds, and creators must pull their withdrawals.
- **Validation**: Strict checks on deadlines and goals.
