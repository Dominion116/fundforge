// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICampaign} from "./ICampaign.sol";
import {CampaignLib} from "../libraries/CampaignLib.sol";
import {ReentrancyGuard} from "@openzeppelin/utils/ReentrancyGuard.sol";

contract Campaign is ICampaign, ReentrancyGuard {
    address public immutable creator;
    string public title;
    string public description;
    uint256 public immutable goal;
    uint256 public immutable deadline;
    uint256 public totalContributed;
    CampaignState public state;

    mapping(address => uint256) public contributions;

    constructor(
        address _creator,
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration
    ) {
        creator = _creator;
        title = _title;
        description = _description;
        goal = _goal;
        deadline = block.timestamp + _duration;
        state = CampaignState.Active;
    }

    function contribute() public payable override nonReentrant {
        CampaignLib.validateContribution(msg.value, deadline);
        if (state != CampaignState.Active) revert CampaignLib.Unauthorized();

        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;

        emit Contributed(msg.sender, msg.value);

        if (totalContributed >= goal) {
            // We don't automatically mark as successful here to allow more funds,
            // but we could. For now, we'll keep it active until deadline.
        }
    }

    function withdraw() external override nonReentrant {
        if (msg.sender != creator) revert CampaignLib.Unauthorized();
        if (block.timestamp < deadline) revert CampaignLib.CampaignNotEnded();
        if (totalContributed < goal) revert CampaignLib.GoalNotReached();
        if (state == CampaignState.Successful) revert CampaignLib.Unauthorized();

        state = CampaignState.Successful;
        uint256 amount = address(this).balance;
        
        (bool success, ) = payable(creator).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(creator, amount);
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

    receive() external payable {
        contribute();
    }
}
