// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MilestoneCampaign} from "../contracts/core/MilestoneCampaign.sol";
import {CampaignFactory} from "../contracts/core/CampaignFactory.sol";
import {ICampaign} from "../contracts/core/ICampaign.sol";
import {IMilestoneCampaign} from "../contracts/core/IMilestoneCampaign.sol";

contract MilestoneCampaignTest is Test {
    CampaignFactory public factory;
    MilestoneCampaign public campaign;
    
    address public feeRecipient = address(100);
    address public creator = address(1);
    address public contributor1 = address(2);
    address public contributor2 = address(3);
    address public contributor3 = address(4);

    uint256 public constant GOAL = 10 ether;
    uint256 public constant DURATION = 30 days;
    uint256 public constant VOTING_DURATION = 7 days;

    string[] public milestoneDescriptions;
    uint256[] public milestoneAmounts;

    event MilestoneVotingStarted(uint256 indexed milestoneId, uint256 votingDeadline);
    event MilestoneVoted(uint256 indexed milestoneId, address indexed voter, bool support, uint256 votingPower);
    event MilestoneApproved(uint256 indexed milestoneId);
    event MilestoneRejected(uint256 indexed milestoneId);
    event MilestoneCompleted(uint256 indexed milestoneId, uint256 amount);

    function setUp() public {
        factory = new CampaignFactory(feeRecipient);
        
        // Setup 3 milestones
        milestoneDescriptions.push("Phase 1: Research & Planning");
        milestoneDescriptions.push("Phase 2: Development");
        milestoneDescriptions.push("Phase 3: Launch & Marketing");
        
        milestoneAmounts.push(3 ether);
        milestoneAmounts.push(4 ether);
        milestoneAmounts.push(3 ether);

        vm.prank(creator);
        address campaignAddr = factory.createMilestoneCampaign(
            "Milestone Test Campaign",
            "Testing milestone functionality",
            GOAL,
            DURATION,
            milestoneDescriptions,
            milestoneAmounts
        );
        campaign = MilestoneCampaign(payable(campaignAddr));
    }

    function test_Initialization() public view {
        assertEq(campaign.creator(), creator);
        assertEq(campaign.goal(), GOAL);
        assertEq(campaign.getMilestoneCount(), 3);
        assertEq(campaign.getTotalMilestoneAmount(), 10 ether);
        
        IMilestoneCampaign.MilestoneInfo memory milestone0 = campaign.getMilestoneInfo(0);
        assertEq(milestone0.description, "Phase 1: Research & Planning");
        assertEq(milestone0.amount, 3 ether);
        assertEq(uint(milestone0.state), uint(IMilestoneCampaign.MilestoneState.Pending));
    }

    function test_ContributeToMilestoneCampaign() public {
        vm.deal(contributor1, 5 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 5 ether}();

        assertEq(campaign.totalContributed(), 5 ether);
        assertEq(campaign.contributions(contributor1), 5 ether);
    }

    function test_CannotStartVotingBeforeGoalReached() public {
        vm.deal(contributor1, 5 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 5 ether}();

        vm.prank(creator);
        vm.expectRevert();
        campaign.startMilestoneVoting(0, VOTING_DURATION);
    }

    function test_StartMilestoneVoting() public {
        // Reach goal
        _reachGoal();

        vm.prank(creator);
        vm.expectEmit(true, false, false, true);
        emit MilestoneVotingStarted(0, block.timestamp + VOTING_DURATION);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        assertEq(uint(milestone.state), uint(IMilestoneCampaign.MilestoneState.VotingActive));
        assertEq(milestone.votingDeadline, block.timestamp + VOTING_DURATION);
    }

    function test_VoteOnMilestone() public {
        _reachGoal();

        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        // Contributor1 votes in favor (5 ether voting power)
        vm.prank(contributor1);
        vm.expectEmit(true, true, false, true);
        emit MilestoneVoted(0, contributor1, true, 5 ether);
        campaign.voteOnMilestone(0, true);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        assertEq(milestone.votesFor, 5 ether);
        assertEq(milestone.votesAgainst, 0);
    }

    function test_CannotVoteTwice() public {
        _reachGoal();

        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        vm.prank(contributor1);
        campaign.voteOnMilestone(0, true);

        vm.prank(contributor1);
        vm.expectRevert();
        campaign.voteOnMilestone(0, true);
    }

    function test_NonContributorCannotVote() public {
        _reachGoal();

        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        address nonContributor = address(999);
        vm.prank(nonContributor);
        vm.expectRevert();
        campaign.voteOnMilestone(0, true);
    }

    function test_MilestoneApprovedWithQuorum() public {
        _reachGoal();

        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        // Contributor1 (5 ether) votes yes - 50% of total
        vm.prank(contributor1);
        campaign.voteOnMilestone(0, true);

        // Contributor2 (3 ether) votes yes - now 80% of total voted, all yes
        vm.prank(contributor2);
        vm.expectEmit(true, false, false, false);
        emit MilestoneApproved(0);
        campaign.voteOnMilestone(0, true);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        assertEq(uint(milestone.state), uint(IMilestoneCampaign.MilestoneState.Approved));
    }

    function test_MilestoneRejectedWithQuorum() public {
        _reachGoal();

        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        // Contributor1 (5 ether) votes no
        vm.prank(contributor1);
        campaign.voteOnMilestone(0, false);

        // Contributor2 (3 ether) votes no - 80% voted, all no
        vm.prank(contributor2);
        vm.expectEmit(true, false, false, false);
        emit MilestoneRejected(0);
        campaign.voteOnMilestone(0, false);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        assertEq(uint(milestone.state), uint(IMilestoneCampaign.MilestoneState.Rejected));
    }

    function test_MilestoneApprovedAfterDeadline() public {
        _reachGoal();

        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        // Only 30% votes yes
        vm.prank(contributor2);
        campaign.voteOnMilestone(0, true);

        // Fast forward past voting deadline
        vm.warp(block.timestamp + VOTING_DURATION + 1);

        // Finalize voting (anyone can call this after deadline)
        campaign.finalizeMilestoneVoting(0);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        // Should be approved since 100% of votes are yes (even if low turnout)
        assertEq(uint(milestone.state), uint(IMilestoneCampaign.MilestoneState.Approved));
    }

    function test_CompleteMilestone() public {
        _reachGoal();
        _approveFirstMilestone();

        uint256 initialCreatorBalance = creator.balance;
        uint256 initialFeeBalance = feeRecipient.balance;

        vm.prank(creator);
        vm.expectEmit(true, false, false, true);
        emit MilestoneCompleted(0, 3 ether - (3 ether * 500 / 10000));
        campaign.completeMilestone(0);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        assertEq(uint(milestone.state), uint(IMilestoneCampaign.MilestoneState.Completed));

        // Check balances
        uint256 expectedFee = (3 ether * 500) / 10000; // 5%
        uint256 expectedCreatorAmount = 3 ether - expectedFee;
        
        assertEq(creator.balance, initialCreatorBalance + expectedCreatorAmount);
        assertEq(feeRecipient.balance, initialFeeBalance + expectedFee);
        assertEq(campaign.totalWithdrawn(), 3 ether);
    }

    function test_CannotCompleteUnapprovedMilestone() public {
        _reachGoal();

        vm.prank(creator);
        vm.expectRevert();
        campaign.completeMilestone(0);
    }

    function test_CannotCompleteWithInsufficientFunds() public {
        _reachGoal();
        _approveFirstMilestone();

        // Withdraw all funds somehow (this is a contrived scenario)
        // We can simulate this by dealing a lower balance to the contract
        vm.deal(address(campaign), 1 ether);

        // This should fail because we don't have 3 ether to pay out for milestone 0
        vm.prank(creator);
        vm.expectRevert(MilestoneCampaign.InsufficientFunds.selector);
        campaign.completeMilestone(0);
    }

    function test_MultipleMilestonesWorkflow() public {
        _reachGoal();

        // Approve and complete milestone 0
        _approveFirstMilestone();
        vm.prank(creator);
        campaign.completeMilestone(0);

        // Approve and complete milestone 1
        vm.prank(creator);
        campaign.startMilestoneVoting(1, VOTING_DURATION);
        vm.prank(contributor1);
        campaign.voteOnMilestone(1, true);
        vm.prank(contributor2);
        campaign.voteOnMilestone(1, true);

        vm.prank(creator);
        campaign.completeMilestone(1);

        // Approve and complete milestone 2
        vm.prank(creator);
        campaign.startMilestoneVoting(2, VOTING_DURATION);
        vm.prank(contributor1);
        campaign.voteOnMilestone(2, true);
        vm.prank(contributor2);
        campaign.voteOnMilestone(2, true);

        vm.prank(creator);
        campaign.completeMilestone(2);

        // Campaign should be marked as successful
        assertEq(uint(campaign.state()), uint(ICampaign.CampaignState.Successful));
    }

    function test_RefundIfGoalNotReached() public {
        vm.deal(contributor1, 5 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 5 ether}();

        // Fast forward past deadline
        vm.warp(block.timestamp + DURATION + 1);

        uint256 initialBalance = contributor1.balance;
        vm.prank(contributor1);
        campaign.getRefund();

        assertEq(contributor1.balance, initialBalance + 5 ether);
        assertEq(uint(campaign.state()), uint(ICampaign.CampaignState.Failed));
    }

    function test_CannotGetRefundIfGoalReached() public {
        _reachGoal();

        vm.warp(block.timestamp + DURATION + 1);

        vm.prank(contributor1);
        vm.expectRevert();
        campaign.getRefund();
    }

    // Helper functions
    function _reachGoal() internal {
        vm.deal(contributor1, 5 ether);
        vm.deal(contributor2, 3 ether);
        vm.deal(contributor3, 2 ether);

        vm.prank(contributor1);
        campaign.contribute{value: 5 ether}();

        vm.prank(contributor2);
        campaign.contribute{value: 3 ether}();

        vm.prank(contributor3);
        campaign.contribute{value: 2 ether}();

        assertEq(campaign.totalContributed(), 10 ether);
    }

    function _approveFirstMilestone() internal {
        vm.prank(creator);
        campaign.startMilestoneVoting(0, VOTING_DURATION);

        vm.prank(contributor1);
        campaign.voteOnMilestone(0, true);

        vm.prank(contributor2);
        campaign.voteOnMilestone(0, true);

        IMilestoneCampaign.MilestoneInfo memory milestone = campaign.getMilestoneInfo(0);
        assertEq(uint(milestone.state), uint(IMilestoneCampaign.MilestoneState.Approved));
    }
}
