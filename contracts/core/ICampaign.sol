// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICampaign {
    enum CampaignState { Active, Successful, Failed, Cancelled }

    struct CampaignInfo {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 totalContributed;
        CampaignState state;
    }

    event Contributed(address indexed contributor, uint256 amount);
    event Withdrawn(address indexed creator, uint256 amount);
    event Refunded(address indexed contributor, uint256 amount);
    event CampaignStateChanged(CampaignState newState);

    function contribute() external payable;
    function withdraw() external;
    function getRefund() external;
    function getCampaignInfo() external view returns (CampaignInfo memory);
}
