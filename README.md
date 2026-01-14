# FundForge

A decentralized crowdfunding platform built with Solidity and Foundry.

## Features

### Traditional Campaigns
- **Campaign Factory**: Easily deploy new crowdfunding campaigns.
- **Secure Contributions**: ETH contributions with reentrancy protection.
- **Conditional Withdrawals**: Creators can only withdraw if the goal is met by the deadline.
- **Easy Refunds**: Automatic refund system if a campaign fails to reach its goal.

### 🎯 Milestone-Based Campaigns (NEW!)
- **Incremental Fund Release**: Creators set multiple milestones with individual funding amounts.
- **Contributor Voting**: Backers vote on milestone completion before funds are released.
- **Reduced Risk**: Funds released only after milestone approval (66% approval threshold).
- **Accountability**: Voting power proportional to contribution amount.
- **Governance**: 51% quorum required for milestone decisions.

📖 **[Read the full Milestone Funding documentation](docs/milestone-funding.md)**

## Project Structure
- `contracts/`: Smart contract source code.
- `scripts/`: Deployment and interaction scripts (Solidity).
- `test/`: Comprehensive unit tests.
- `docs/`: System documentation.

## Getting Started

### Prerequisites
- [Foundry](https://getfoundry.sh/)

### Installation
```bash
git clone <repo-url>
cd fundforge
forge install
```

### Testing
```bash
forge test
```

### Deployment
```bash
# Copy .env.example to .env and fill in details
source .env
forge script scripts/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Security
This project uses OpenZeppelin contracts and follows security best practices (Reentrancy protection, Pull-over-Push).
