# FundForge Security Considerations

## Identified Risks & Mitigations

### 1. Reentrancy
- **Risk**: External calls during `withdraw` or `getRefund` could allow an attacker to drain the contract.
- **Mitigation**: Used `ReentrancyGuard` from OpenZeppelin and implemented "Checks-Effects-Interactions" pattern.

### 2. Logic Errors in Deadline/Goal
- **Risk**: Users might be able to withdraw before the deadline or when the goal is not met.
- **Mitigation**: Strict validation using `CampaignLib` and `require` statements in `Campaign.sol`.

### 3. Gas Limitations
- **Risk**: Storing large amounts of data or iterating over many contributors could hit gas limits.
- **Mitigation**: Using a "Pull" pattern for refunds so participants handle their own transactions.

### 4. Precision Loss
- **Risk**: Integer division or large numbers could lead to issues.
- **Mitigation**: Using `uint256` for all financial calculations and avoiding division where possible.

## Recommendations
- Conduct a professional audit before deploying to Mainnet.
- Implement a "Pause" mechanism in the factory for emergency situations.
- Add support for ERC20 tokens in future versions.
