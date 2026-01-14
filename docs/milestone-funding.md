# Milestone-Based Funding

## Overview
FundForge now supports **milestone-based campaigns**, a powerful feature that reduces risk for backers and builds trust in the crowdfunding process. Instead of releasing all funds at once, creators can set up multiple milestones with incremental fund releases.

## Key Features

### 🎯 Milestone Structure
- Creators define multiple milestones during campaign creation
- Each milestone has:
  - A description (e.g., "Phase 1: Research & Planning")
  - A specific funding amount
  - Voting mechanism for approval

### 🗳️ Contributor Voting
- **Voting Power**: Proportional to contribution amount
- **Quorum**: 51% of total contributions must participate
- **Approval Threshold**: 66% of votes must approve
- **Voting Period**: Set by creator when starting milestone voting

### 💰 Incremental Fund Release
- Funds released only after milestone approval
- Platform fee (default 5%) deducted from each milestone
- Prevents "rug pulls" and builds accountability

## How It Works

### For Campaign Creators

#### 1. Create a Milestone Campaign
```solidity
string[] memory descriptions = new string[](3);
descriptions[0] = "Phase 1: Research & Planning";
descriptions[1] = "Phase 2: Development";
descriptions[2] = "Phase 3: Launch & Marketing";

uint256[] memory amounts = new uint256[](3);
amounts[0] = 3 ether;
amounts[1] = 4 ether;
amounts[2] = 3 ether;

address campaign = factory.createMilestoneCampaign(
    "My Project",
    "Description",
    10 ether,  // total goal
    30 days,   // duration
    descriptions,
    amounts
);
```

#### 2. Start Milestone Voting
After the campaign reaches its goal, start voting on the first milestone:
```solidity
campaign.startMilestoneVoting(0, 7 days); // 7 day voting period
```

#### 3. Complete Approved Milestones
Once a milestone is approved by contributors:
```solidity
campaign.completeMilestone(0);
```

### For Contributors

#### 1. Contribute to Campaign
```solidity
campaign.contribute{value: 1 ether}();
```

#### 2. Vote on Milestones
When voting is active, vote to approve or reject:
```solidity
campaign.voteOnMilestone(0, true);  // true = approve, false = reject
```

Your voting power equals your contribution amount.

#### 3. Get Refunds (if goal not reached)
If the campaign fails to reach its goal:
```solidity
campaign.getRefund();
```

## Voting Mechanics

### Automatic Finalization
Voting is finalized when either:
1. **Quorum reached**: 51%+ of contributions have voted
2. **Deadline passed**: Voting period expires

### Approval Logic
A milestone is **approved** if:
- 66%+ of votes are in favor

A milestone is **rejected** if:
- Less than 66% of votes are in favor

### Example Scenario
Campaign raised: **10 ETH**
- Contributor A: 5 ETH (50% voting power)
- Contributor B: 3 ETH (30% voting power)  
- Contributor C: 2 ETH (20% voting power)

**Scenario 1: Quick Approval**
- A votes YES (5 ETH)
- B votes YES (3 ETH)
- Total: 8 ETH voted (80% of total) ✅ Quorum reached
- Approval: 8/8 = 100% ✅ Approved

**Scenario 2: Rejection**
- A votes NO (5 ETH)
- B votes NO (3 ETH)
- Total: 8 ETH voted (80% of total) ✅ Quorum reached
- Approval: 0/8 = 0% ❌ Rejected

**Scenario 3: Mixed Votes**
- A votes YES (5 ETH)
- B votes NO (3 ETH)
- C votes YES (2 ETH)
- Total: 10 ETH voted (100% of total) ✅ Quorum reached
- Approval: 7/10 = 70% ✅ Approved (above 66% threshold)

## State Machine

### Milestone States
1. **Pending**: Initial state, waiting for creator to start voting
2. **VotingActive**: Contributors can vote
3. **Approved**: Passed voting, ready for completion
4. **Rejected**: Failed voting, cannot be completed
5. **Completed**: Funds released to creator

### Campaign States
- **Active**: Accepting contributions
- **Successful**: All milestones completed or funds withdrawn
- **Failed**: Goal not reached, refunds available
- **Cancelled**: (Future feature)

## Security Features

### ✅ Reentrancy Protection
All state-changing functions use `nonReentrant` modifier

### ✅ Validation Checks
- Milestone amounts validated at creation
- Cannot vote twice on same milestone
- Only contributors can vote
- Only creator can start voting and complete milestones

### ✅ Fund Safety
- Funds locked until milestone approval
- Insufficient funds check before completion
- Pull-over-push pattern for withdrawals

## Gas Optimization

- Milestone data stored efficiently
- Voting power calculated from existing contribution mapping
- Minimal storage updates during voting

## Events

Track all milestone activities:
```solidity
event MilestoneCreated(uint256 indexed milestoneId, string description, uint256 amount);
event MilestoneVotingStarted(uint256 indexed milestoneId, uint256 votingDeadline);
event MilestoneVoted(uint256 indexed milestoneId, address indexed voter, bool support, uint256 votingPower);
event MilestoneApproved(uint256 indexed milestoneId);
event MilestoneRejected(uint256 indexed milestoneId);
event MilestoneCompleted(uint256 indexed milestoneId, uint256 amount);
```

## View Functions

Query milestone information:
```solidity
// Get milestone details
MilestoneInfo memory info = campaign.getMilestoneInfo(0);

// Get total number of milestones
uint256 count = campaign.getMilestoneCount();

// Get sum of all milestone amounts
uint256 total = campaign.getTotalMilestoneAmount();

// Check if address has voted
bool voted = campaign.hasVotedOnMilestone(0, contributorAddress);
```

## Best Practices

### For Creators
1. **Plan milestones carefully**: Break project into logical phases
2. **Set realistic amounts**: Ensure each milestone amount covers its phase
3. **Communicate clearly**: Provide detailed milestone descriptions
4. **Start voting promptly**: Don't delay after reaching goal
5. **Deliver on milestones**: Build trust for future campaigns

### For Contributors
1. **Review milestones**: Check if milestones make sense before contributing
2. **Vote actively**: Participate in governance
3. **Vote honestly**: Approve only if milestone is genuinely completed
4. **Monitor progress**: Stay engaged with campaign updates

## Comparison: Traditional vs Milestone Campaigns

| Feature | Traditional Campaign | Milestone Campaign |
|---------|---------------------|-------------------|
| Fund Release | All at once after deadline | Incremental per milestone |
| Contributor Control | None after contribution | Vote on each milestone |
| Creator Accountability | Low | High |
| Risk for Backers | Higher | Lower |
| Complexity | Simple | Moderate |
| Best For | Small, trusted projects | Large, complex projects |

## Future Enhancements

Potential additions to milestone system:
- ⏱️ Automatic milestone scheduling
- 📝 On-chain milestone evidence/proof
- 🔄 Milestone revision voting
- 💬 Discussion period before voting
- 📊 Reputation system based on milestone completion
- 🎁 Bonus rewards for early milestone completion

## Example Use Cases

### Software Development
```
Milestone 1: Design & Architecture (20%)
Milestone 2: Core Development (40%)
Milestone 3: Testing & QA (20%)
Milestone 4: Launch & Documentation (20%)
```

### Product Manufacturing
```
Milestone 1: Prototype Development (30%)
Milestone 2: Manufacturing Setup (30%)
Milestone 3: Production & Quality Control (25%)
Milestone 4: Shipping & Distribution (15%)
```

### Creative Projects
```
Milestone 1: Pre-production (25%)
Milestone 2: Production (50%)
Milestone 3: Post-production & Distribution (25%)
```

## Integration with Frontend

Example frontend integration:
```javascript
// Create milestone campaign
const tx = await factory.createMilestoneCampaign(
  title,
  description,
  goalAmount,
  duration,
  milestoneDescriptions,
  milestoneAmounts
);

// Vote on milestone
const voteTx = await campaign.voteOnMilestone(milestoneId, true);

// Complete milestone
const completeTx = await campaign.completeMilestone(milestoneId);
```

## Testing

Run comprehensive tests:
```bash
forge test --match-contract MilestoneCampaignTest -vvv
```

Test coverage includes:
- ✅ Milestone creation and initialization
- ✅ Voting mechanics and quorum
- ✅ Approval and rejection scenarios
- ✅ Fund release and fee distribution
- ✅ Multiple milestone workflows
- ✅ Edge cases and error conditions
