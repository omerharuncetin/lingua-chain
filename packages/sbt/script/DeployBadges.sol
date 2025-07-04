// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import { LinguaA1LanguageBadge } from '../src/badges/A1Badge.sol';
import { LinguaA2LanguageBadge } from '../src/badges/A2Badge.sol';
import { LinguaB1LanguageBadge } from '../src/badges/B1Badge.sol';
import { LinguaB2LanguageBadge } from '../src/badges/B2Badge.sol';
import { LinguaC1LanguageBadge } from '../src/badges/C1Badge.sol';
import { LinguaC2LanguageBadge } from '../src/badges/C2Badge.sol';
import { Script } from '../lib/forge-std/src/Script.sol';

contract BadgesScript is Script {
    function run() public {
        vm.createSelectFork("celo-alfajore");
        vm.startBroadcast();
        new LinguaA1LanguageBadge();
        new LinguaA2LanguageBadge();
        new LinguaB1LanguageBadge();
        new LinguaB2LanguageBadge();
        new LinguaC1LanguageBadge();
        new LinguaC2LanguageBadge();
        vm.stopBroadcast();
    }
}