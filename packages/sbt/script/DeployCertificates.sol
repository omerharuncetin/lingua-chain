// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {LinguaA1Certificate} from '../src/certificates/A1Certificate.sol';
import {LinguaA2Certificate} from '../src/certificates/A2Certificate.sol';
import {LinguaB1Certificate} from '../src/certificates/B1Certificate.sol';
import {LinguaB2Certificate} from '../src/certificates/B2Certificate.sol';
import {LinguaC1Certificate} from '../src/certificates/C1Certificate.sol';
import {LinguaC2Certificate} from '../src/certificates/C2Certificate.sol';
import {Script} from '../lib/forge-std/src/Script.sol';

contract CertificateScript is Script {
  function run() public {
    vm.createSelectFork('celo-alfajore');
    vm.startBroadcast();
    LinguaA1Certificate a1 = new LinguaA1Certificate();
    LinguaA2Certificate a2 = new LinguaA2Certificate();
    LinguaB1Certificate b1 = new LinguaB1Certificate();
    LinguaB2Certificate b2 = new LinguaB2Certificate();
    LinguaC1Certificate c1 = new LinguaC1Certificate();
    LinguaC2Certificate c2 = new LinguaC2Certificate();

    a1.setLinguaContract(address(0));
    a2.setLinguaContract(address(0));
    b1.setLinguaContract(address(0));
    b2.setLinguaContract(address(0));
    c1.setLinguaContract(address(0));
    c2.setLinguaContract(address(0));
    vm.stopBroadcast();
  }
}
