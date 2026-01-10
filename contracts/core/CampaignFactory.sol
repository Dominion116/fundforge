// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Campaign} from "./Campaign.sol";
import {ICampaign} from "./ICampaign.sol";

contract CampaignFactory {
    address[] public allCampaigns;
    mapping(address => address[]) public creatorCampaigns;

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration
    ) external returns (address) {
        Campaign newCampaign = new Campaign(
            msg.sender,
            _title,
            _description,
            _goal,
            _duration
        );

        address campaignAddress = address(newCampaign);
        allCampaigns.push(campaignAddress);
        creatorCampaigns[msg.sender].push(campaignAddress);

        emit CampaignCreated(
            campaignAddress,
            msg.sender,
            _title,
            _goal,
            block.timestamp + _duration
        );

        return campaignAddress;
    }

    function getAllCampaigns() external view returns (address[] memory) {
        return allCampaigns;
    }

    function getCreatorCampaigns(address _creator) external view returns (address[] memory) {
        return creatorCampaigns[_creator];
    }

    function getCampaignCount() external view returns (uint256) {
        return allCampaigns.length;
    }
}
