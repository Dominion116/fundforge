// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library CampaignLib {
    error InvalidAmount();
    error DeadlinePassed();
    error CampaignNotEnded();
    error GoalNotReached();
    error GoalReached();
    error Unauthorized();

    function validateContribution(uint256 amount, uint256 deadline) internal view {
        if (amount == 0) revert InvalidAmount();
        if (block.timestamp > deadline) revert DeadlinePassed();
    }

    function canWithdraw(uint256 totalContributed, uint256 goal, uint256 deadline) internal view returns (bool) {
        return block.timestamp > deadline && totalContributed >= goal;
    }

    function canRefund(uint256 totalContributed, uint256 goal, uint256 deadline) internal view returns (bool) {
        return block.timestamp > deadline && totalContributed < goal;
    }
}
