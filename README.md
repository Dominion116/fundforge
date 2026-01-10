# FundForge

A decentralized crowdfunding platform built with Solidity and Foundry.

## Features
- **Campaign Factory**: Easily deploy new crowdfunding campaigns.
- **Secure Contributions**: ETH contributions with reentrancy protection.
- **Conditional Withdrawals**: Creators can only withdraw if the goal is met by the deadline.
- **Easy Refunds**: Automatic refund system if a campaign fails to reach its goal.

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
