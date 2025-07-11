// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {LinguaA1Certificate} from '../src/certificates/A1Certificate.sol';
import {LinguaA2Certificate} from '../src/certificates/A2Certificate.sol';
import {LinguaB1Certificate} from '../src/certificates/B1Certificate.sol';
import {LinguaB2Certificate} from '../src/certificates/B2Certificate.sol';
import {LinguaC1Certificate} from '../src/certificates/C1Certificate.sol';
import {LinguaC2Certificate} from '../src/certificates/C2Certificate.sol';
import {Script} from '../lib/forge-std/src/Script.sol';

contract CertificateScript is Script {
  function run() public {
    vm.createSelectFork('celo-alfajores');
    vm.startBroadcast();
    //LinguaA1Certificate a1 = new LinguaA1Certificate();
    LinguaA2Certificate a2 = new LinguaA2Certificate();
    LinguaB1Certificate b1 = new LinguaB1Certificate();
    LinguaB2Certificate b2 = new LinguaB2Certificate();
    LinguaC1Certificate c1 = new LinguaC1Certificate();
    LinguaC2Certificate c2 = new LinguaC2Certificate();

    //a1.setLinguaContract(0x352C49d519AF8d9d294345E29D50c2f6d6E3901E);
    a2.setLinguaContract(0x352C49d519AF8d9d294345E29D50c2f6d6E3901E);
    b1.setLinguaContract(0x352C49d519AF8d9d294345E29D50c2f6d6E3901E);
    b2.setLinguaContract(0x352C49d519AF8d9d294345E29D50c2f6d6E3901E);
    c1.setLinguaContract(0x352C49d519AF8d9d294345E29D50c2f6d6E3901E);
    c2.setLinguaContract(0x352C49d519AF8d9d294345E29D50c2f6d6E3901E);
    vm.stopBroadcast();
  }
}
