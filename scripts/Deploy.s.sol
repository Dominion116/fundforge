// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {CampaignFactory} from "../contracts/core/CampaignFactory.sol";

contract DeployFundForge is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        CampaignFactory factory = new CampaignFactory(vm.addr(deployerPrivateKey));
        
        console2.log("CampaignFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
