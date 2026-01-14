// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICampaign} from "./ICampaign.sol";

interface IMilestoneCampaign is ICampaign {
    enum MilestoneState { Pending, VotingActive, Approved, Rejected, Completed }

    struct Milestone {
        string description;
        uint256 amount;
        uint48 votingDeadline;
        MilestoneState state;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
    }

    struct MilestoneInfo {
        string description;
        uint256 amount;
        uint48 votingDeadline;
        uint256 votesFor;
        uint256 votesAgainst;
        MilestoneState state;
    }

    event MilestoneCreated(uint256 indexed milestoneId, string description, uint256 amount);
    event MilestoneVotingStarted(uint256 indexed milestoneId, uint256 votingDeadline);
    event MilestoneVoted(uint256 indexed milestoneId, address indexed voter, bool support, uint256 votingPower);
    event MilestoneApproved(uint256 indexed milestoneId);
    event MilestoneRejected(uint256 indexed milestoneId);
    event MilestoneCompleted(uint256 indexed milestoneId, uint256 amount);

    function startMilestoneVoting(uint256 milestoneId, uint256 votingDuration) external;
    function voteOnMilestone(uint256 milestoneId, bool support) external;
    function finalizeMilestoneVoting(uint256 milestoneId) external;
    function completeMilestone(uint256 milestoneId) external;
    function getMilestoneInfo(uint256 milestoneId) external view returns (MilestoneInfo memory);
    function getMilestoneCount() external view returns (uint256);
    function getTotalMilestoneAmount() external view returns (uint256);
}
