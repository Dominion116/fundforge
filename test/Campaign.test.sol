// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Campaign} from "../contracts/core/Campaign.sol";
import {CampaignFactory} from "../contracts/core/CampaignFactory.sol";
import {ICampaign} from "../contracts/core/ICampaign.sol";

contract CampaignTest is Test {
    CampaignFactory public factory;
    Campaign public campaign;
    address public feeRecipient = address(100);
    address public creator = address(1);
    address public contributor1 = address(2);
    address public contributor2 = address(3);

    uint256 public constant GOAL = 10 ether;
    uint256 public constant DURATION = 1 days;

    function setUp() public {
        factory = new CampaignFactory(feeRecipient);
        vm.prank(creator);
        address campaignAddr = factory.createCampaign(
            "Test Campaign",
            "This is a test",
            GOAL,
            DURATION
        );
        campaign = Campaign(payable(campaignAddr));
    }

    function test_Initialization() public view {
        assertEq(campaign.creator(), creator);
        assertEq(campaign.goal(), GOAL);
        assertEq(campaign.title(), "Test Campaign");
        assertEq(uint(campaign.state()), uint(ICampaign.CampaignState.Active));
        assertEq(campaign.feeRecipient(), feeRecipient);
        assertEq(campaign.feePercentage(), 500);
    }

    function test_Contribute() public {
        vm.deal(contributor1, 5 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 1 ether}();

        assertEq(campaign.totalContributed(), 1 ether);
        assertEq(campaign.contributions(contributor1), 1 ether);
    }

    function test_WithdrawSuccess() public {
        vm.deal(contributor1, 10 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 10 ether}();

        vm.warp(block.timestamp + DURATION + 1);

        uint256 initialCreatorBalance = creator.balance;
        uint256 initialFeeBalance = feeRecipient.balance;
        
        uint256 expectedFee = (10 ether * 500) / 10000; // 5%
        uint256 expectedCreatorAmount = 10 ether - expectedFee;

        vm.prank(creator);
        campaign.withdraw();

        assertEq(creator.balance, initialCreatorBalance + expectedCreatorAmount);
        assertEq(feeRecipient.balance, initialFeeBalance + expectedFee);
        assertEq(uint(campaign.state()), uint(ICampaign.CampaignState.Successful));
    }

    function test_RefundOnFailure() public {
        vm.deal(contributor1, 5 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 5 ether}();

        vm.warp(block.timestamp + DURATION + 1);

        uint256 initialContributorBalance = contributor1.balance;
        vm.prank(contributor1);
        campaign.getRefund();

        assertEq(contributor1.balance, initialContributorBalance + 5 ether);
        assertEq(uint(campaign.state()), uint(ICampaign.CampaignState.Failed));
    }

    function test_CannotWithdrawBeforeDeadline() public {
        vm.deal(contributor1, 10 ether);
        vm.prank(contributor1);
        campaign.contribute{value: 10 ether}();

        vm.prank(creator);
        vm.expectRevert();
        campaign.withdraw();
    }
}
