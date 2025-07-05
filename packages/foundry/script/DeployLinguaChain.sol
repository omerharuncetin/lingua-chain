// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from '../lib/forge-std/src/Script.sol';
import {LinguaChain} from '../src/LinguaChain.sol';

contract CertificateScript is Script {
  function run() public {
    vm.createSelectFork('celo-alfajores');
    vm.startBroadcast();

    new LinguaChain(0x68c931C9a534D37aa78094877F46fE46a49F1A51, 5);

    vm.stopBroadcast();
  }
}
