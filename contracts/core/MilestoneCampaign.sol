// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICampaign} from "./ICampaign.sol";
import {IMilestoneCampaign} from "./IMilestoneCampaign.sol";
import {CampaignLib} from "../libraries/CampaignLib.sol";
import {ReentrancyGuard} from "@openzeppelin/utils/ReentrancyGuard.sol";

/**
 * @title MilestoneCampaign
 * @notice A crowdfunding campaign with milestone-based fund release
 * @dev Extends basic campaign functionality with milestone voting and incremental withdrawals
 */
contract MilestoneCampaign is IMilestoneCampaign, ReentrancyGuard {
    address public immutable creator;
    string public title;
    string public description;
    uint256 public immutable goal;
    uint256 public immutable deadline;
    uint256 public totalContributed;
    uint256 public totalWithdrawn;
    CampaignState public state;

    address public immutable feeRecipient;
    uint16 public immutable feePercentage;

    mapping(address => uint256) public contributions;
    
    // Milestone management
    Milestone[] private milestones;
    uint256 public constant VOTING_QUORUM_PERCENTAGE = 51; // 51% of contributors must vote
    uint256 public constant APPROVAL_THRESHOLD_PERCENTAGE = 66; // 66% must approve

    error InvalidMilestoneConfiguration();
    error MilestoneNotFound();
    error InvalidMilestoneState();
    error VotingNotActive();
    error AlreadyVoted();
    error NotAContributor();
    error InsufficientFunds();
    error MilestoneAmountExceedsBalance();

    constructor(
        address _creator,
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration,
        address _feeRecipient,
        uint16 _feePercentage,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneAmounts
    ) {
        if (_milestoneDescriptions.length != _milestoneAmounts.length) {
            revert InvalidMilestoneConfiguration();
        }
        if (_milestoneDescriptions.length == 0) {
            revert InvalidMilestoneConfiguration();
        }

        creator = _creator;
        title = _title;
        description = _description;
        goal = _goal;
        deadline = block.timestamp + _duration;
        feeRecipient = _feeRecipient;
        feePercentage = _feePercentage;
        state = CampaignState.Active;

        // Validate that milestone amounts sum up correctly
        uint256 totalMilestoneAmount = 0;
        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            if (_milestoneAmounts[i] == 0) revert InvalidMilestoneConfiguration();
            
            milestones.push();
            Milestone storage milestone = milestones[i];
            milestone.description = _milestoneDescriptions[i];
            milestone.amount = _milestoneAmounts[i];
            milestone.state = MilestoneState.Pending;
            
            totalMilestoneAmount += _milestoneAmounts[i];
            
            emit MilestoneCreated(i, _milestoneDescriptions[i], _milestoneAmounts[i]);
        }

        // Milestone amounts should not exceed the goal
        if (totalMilestoneAmount > _goal) {
            revert InvalidMilestoneConfiguration();
        }
    }

    function contribute() public payable override nonReentrant {
        CampaignLib.validateContribution(msg.value, deadline);
        if (state != CampaignState.Active) revert CampaignLib.Unauthorized();

        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;

        emit Contributed(msg.sender, msg.value);
    }

    /**
     * @notice Start voting on a specific milestone
     * @param milestoneId The ID of the milestone to start voting on
     * @param votingDuration Duration of the voting period in seconds
     */
    function startMilestoneVoting(uint256 milestoneId, uint256 votingDuration) external override {
        if (msg.sender != creator) revert CampaignLib.Unauthorized();
        if (milestoneId >= milestones.length) revert MilestoneNotFound();
        if (totalContributed < goal) revert CampaignLib.GoalNotReached();
        
        Milestone storage milestone = milestones[milestoneId];
        if (milestone.state != MilestoneState.Pending) revert InvalidMilestoneState();

        milestone.state = MilestoneState.VotingActive;
        milestone.votingDeadline = block.timestamp + votingDuration;

        emit MilestoneVotingStarted(milestoneId, milestone.votingDeadline);
    }

    /**
     * @notice Vote on a milestone completion
     * @param milestoneId The ID of the milestone to vote on
     * @param support True to approve, false to reject
     */
    function voteOnMilestone(uint256 milestoneId, bool support) external override {
        if (milestoneId >= milestones.length) revert MilestoneNotFound();
        if (contributions[msg.sender] == 0) revert NotAContributor();

        Milestone storage milestone = milestones[milestoneId];
        if (milestone.state != MilestoneState.VotingActive) revert VotingNotActive();
        if (block.timestamp > milestone.votingDeadline) revert CampaignLib.DeadlinePassed();
        if (milestone.hasVoted[msg.sender]) revert AlreadyVoted();

        milestone.hasVoted[msg.sender] = true;
        uint256 votingPower = contributions[msg.sender];

        if (support) {
            milestone.votesFor += votingPower;
        } else {
            milestone.votesAgainst += votingPower;
        }

        emit MilestoneVoted(milestoneId, msg.sender, support, votingPower);

        // Check if voting is complete
        _checkAndFinalizeVoting(milestoneId);
    }

    /**
     * @notice Finalize voting on a milestone after the deadline has passed
     * @param milestoneId The ID of the milestone to finalize
     */
    function finalizeMilestoneVoting(uint256 milestoneId) external override {
        if (milestoneId >= milestones.length) revert MilestoneNotFound();
        
        Milestone storage milestone = milestones[milestoneId];
        if (milestone.state != MilestoneState.VotingActive) revert InvalidMilestoneState();
        if (block.timestamp <= milestone.votingDeadline) revert CampaignLib.Unauthorized();

        _checkAndFinalizeVoting(milestoneId);
    }

    /**
     * @notice Complete a milestone and release funds to creator
     * @param milestoneId The ID of the milestone to complete
     */
    function completeMilestone(uint256 milestoneId) external override nonReentrant {
        if (msg.sender != creator) revert CampaignLib.Unauthorized();
        if (milestoneId >= milestones.length) revert MilestoneNotFound();

        Milestone storage milestone = milestones[milestoneId];
        if (milestone.state != MilestoneState.Approved) revert InvalidMilestoneState();

        // Check if there are sufficient funds
        uint256 availableBalance = address(this).balance;
        if (availableBalance < milestone.amount) revert InsufficientFunds();

        milestone.state = MilestoneState.Completed;

        // Calculate fee and creator amount
        uint256 feeAmount = (milestone.amount * feePercentage) / 10000;
        uint256 creatorAmount = milestone.amount - feeAmount;

        totalWithdrawn += milestone.amount;

        // Transfer fee
        if (feeAmount > 0) {
            (bool feeSuccess, ) = payable(feeRecipient).call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // Transfer to creator
        (bool success, ) = payable(creator).call{value: creatorAmount}("");
        require(success, "Creator transfer failed");

        emit MilestoneCompleted(milestoneId, creatorAmount);
        emit Withdrawn(creator, creatorAmount);

        // Check if all milestones are completed
        _checkCampaignCompletion();
    }

    /**
     * @notice Fallback withdraw function for traditional campaigns (if goal reached but no milestones approved)
     */
    function withdraw() external override nonReentrant {
        if (msg.sender != creator) revert CampaignLib.Unauthorized();
        if (block.timestamp < deadline) revert CampaignLib.CampaignNotEnded();
        if (totalContributed < goal) revert CampaignLib.GoalNotReached();
        if (state == CampaignState.Successful) revert CampaignLib.Unauthorized();

        // This is a fallback - only allow if no milestones are in progress
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].state == MilestoneState.VotingActive) {
                revert InvalidMilestoneState();
            }
        }

        state = CampaignState.Successful;
        uint256 totalBalance = address(this).balance;
        
        uint256 feeAmount = (totalBalance * feePercentage) / 10000;
        uint256 creatorAmount = totalBalance - feeAmount;

        totalWithdrawn = totalBalance;

        if (feeAmount > 0) {
            (bool feeSuccess, ) = payable(feeRecipient).call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }

        (bool success, ) = payable(creator).call{value: creatorAmount}("");
        require(success, "Creator transfer failed");

        emit Withdrawn(creator, creatorAmount);
        emit CampaignStateChanged(CampaignState.Successful);
    }

    function getRefund() external override nonReentrant {
        if (block.timestamp < deadline) revert CampaignLib.CampaignNotEnded();
        if (totalContributed >= goal) revert CampaignLib.GoalReached();
        
        uint256 amount = contributions[msg.sender];
        if (amount == 0) revert CampaignLib.InvalidAmount();

        contributions[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Refunded(msg.sender, amount);
        
        if (state != CampaignState.Failed) {
            state = CampaignState.Failed;
            emit CampaignStateChanged(CampaignState.Failed);
        }
    }

    function getCampaignInfo() external view override returns (CampaignInfo memory) {
        return CampaignInfo({
            creator: creator,
            title: title,
            description: description,
            goal: goal,
            deadline: deadline,
            totalContributed: totalContributed,
            state: state
        });
    }

    function getMilestoneInfo(uint256 milestoneId) external view override returns (MilestoneInfo memory) {
        if (milestoneId >= milestones.length) revert MilestoneNotFound();
        
        Milestone storage milestone = milestones[milestoneId];
        return MilestoneInfo({
            description: milestone.description,
            amount: milestone.amount,
            votingDeadline: milestone.votingDeadline,
            votesFor: milestone.votesFor,
            votesAgainst: milestone.votesAgainst,
            state: milestone.state
        });
    }

    function getMilestoneCount() external view override returns (uint256) {
        return milestones.length;
    }

    function getTotalMilestoneAmount() external view override returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < milestones.length; i++) {
            total += milestones[i].amount;
        }
        return total;
    }

    function hasVotedOnMilestone(uint256 milestoneId, address voter) external view returns (bool) {
        if (milestoneId >= milestones.length) revert MilestoneNotFound();
        return milestones[milestoneId].hasVoted[voter];
    }

    // Internal functions

    function _checkAndFinalizeVoting(uint256 milestoneId) internal {
        Milestone storage milestone = milestones[milestoneId];
        
        uint256 totalVotes = milestone.votesFor + milestone.votesAgainst;
        
        // Check if quorum is reached (51% of total contributions)
        uint256 quorumRequired = (totalContributed * VOTING_QUORUM_PERCENTAGE) / 100;
        
        if (totalVotes >= quorumRequired || block.timestamp > milestone.votingDeadline) {
            // Finalize voting
            uint256 approvalPercentage = totalVotes > 0 
                ? (milestone.votesFor * 100) / totalVotes 
                : 0;

            if (approvalPercentage >= APPROVAL_THRESHOLD_PERCENTAGE) {
                milestone.state = MilestoneState.Approved;
                emit MilestoneApproved(milestoneId);
            } else {
                milestone.state = MilestoneState.Rejected;
                emit MilestoneRejected(milestoneId);
            }
        }
    }

    function _checkCampaignCompletion() internal {
        bool allCompleted = true;
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].state != MilestoneState.Completed && 
                milestones[i].state != MilestoneState.Rejected) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted && state != CampaignState.Successful) {
            state = CampaignState.Successful;
            emit CampaignStateChanged(CampaignState.Successful);
        }
    }

    receive() external payable {
        contribute();
    }
}
