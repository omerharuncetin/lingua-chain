// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import { LinguaA1Certificate } from '../src/certificates/A1Certificate.sol';
import { LinguaA2Certificate } from '../src/certificates/A2Certificate.sol';
import { LinguaB1Certificate } from '../src/certificates/B1Certificate.sol';
import { LinguaB2Certificate } from '../src/certificates/B2Certificate.sol';
import { LinguaC1Certificate } from '../src/certificates/C1Certificate.sol';
import { LinguaC2Certificate } from '../src/certificates/C2Certificate.sol';
import { Script } from '../lib/forge-std/src/Script.sol';

contract CertificateScript is Script {
    function run() public {
        vm.createSelectFork("celo-alfajore");
        vm.startBroadcast();
        new LinguaA1Certificate();
        new LinguaA2Certificate();
        new LinguaB1Certificate();
        new LinguaB2Certificate();
        new LinguaC1Certificate();
        new LinguaC2Certificate();
        vm.stopBroadcast();
    }
}