// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Campaign} from "../core/Campaign.sol";

contract MockCampaign is Campaign {
    constructor(
        address _creator,
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration
    ) Campaign(_creator, _title, _description, _goal, _duration) {}

    // Add mock-specific functions if needed, e.g., to force state changes for testing
    function forceSetState(CampaignState _state) external {
        state = _state;
    }
}
