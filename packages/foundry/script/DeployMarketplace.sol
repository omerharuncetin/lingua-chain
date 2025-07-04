// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import { MultiNFTMarketplace } from '../src/Marketplace.sol';
import { Script } from '../lib/';

contract MarketplaceScript is Script {
    function run() public {
        vm.createSelectFork("celo-alfajore");
        vm.startBroadcast();
        new MultiNFTMarketplace();
        vm.stopBroadcast();
    }
}