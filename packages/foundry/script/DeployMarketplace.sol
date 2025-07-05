// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from '../lib/forge-std/src/Script.sol';
import {LinguaAvatarMarketplace} from '../src/Marketplace.sol';

contract MarketplaceScript is Script {
  function run() public {
    vm.createSelectFork('celo-alfajores');
    vm.startBroadcast();

    new LinguaAvatarMarketplace(0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B); // usdc address

    vm.stopBroadcast();
  }
}
