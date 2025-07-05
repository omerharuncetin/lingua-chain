// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from '../lib/forge-std/src/Script.sol';
import {LingoBot} from '../src/avatars/LingoBot.sol';
import {PolyglotPanda} from '../src/avatars/PolyglotPanda.sol';
import {GrammarGoblin} from '../src/avatars/GrammarGoblin.sol';
import {SyntaxSeraph} from '../src/avatars/SyntaxSeraph.sol';
import {VerbViper} from '../src/avatars/VerbViper.sol';

contract AvatarsScript is Script {
  function run() public {
    vm.createSelectFork('celo-alfajores');
    vm.startBroadcast();

    LingoBot lingoBot = new LingoBot();
    PolyglotPanda polyglotPanda = new PolyglotPanda();
    GrammarGoblin grammarGoblin = new GrammarGoblin();
    SyntaxSeraph syntaxSeraph = new SyntaxSeraph();
    VerbViper verbViper = new VerbViper();

    lingoBot.setMarketplaceContract(0x5Ec2e78ec51DE81bb048c2315175577266AE5ac8);
    polyglotPanda.setMarketplaceContract(0x5Ec2e78ec51DE81bb048c2315175577266AE5ac8);
    grammarGoblin.setMarketplaceContract(0x5Ec2e78ec51DE81bb048c2315175577266AE5ac8);
    syntaxSeraph.setMarketplaceContract(0x5Ec2e78ec51DE81bb048c2315175577266AE5ac8);
    verbViper.setMarketplaceContract(0x5Ec2e78ec51DE81bb048c2315175577266AE5ac8);

    vm.stopBroadcast();
  }
}
