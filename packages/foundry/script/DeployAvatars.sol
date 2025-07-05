// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {LingoBot} from '../src/avatars/LingoBot.sol';
import {PolyglotPanda} from '../src/avatars/PolyglotPanda.sol';
import {GrammarGoblin} from '../src/avatars/GrammarGoblin.sol';
import {SyntaxSeraph} from '../src/avatars/SyntaxSeraph.sol';
import {VerbViper} from '../src/avatars/VerbViper.sol';
import {Script} from '../lib/';

contract BadgesScript is Script {
  function run() public {
    vm.createSelectFork('celo-alfajore');
    vm.startBroadcast();
    new LingoBot();
    new PolyglotPanda();
    new GrammarGoblin();
    new SyntaxSeraph();
    new VerbViper();
    vm.stopBroadcast();
  }
}
