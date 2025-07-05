// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from '@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol';
import {ISelfVerificationRoot} from '@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol';
import {IIdentityVerificationHubV2} from '@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol';
import {SelfStructs} from '@selfxyz/contracts/contracts/libraries/SelfStructs.sol';
import {AttestationId} from '@selfxyz/contracts/contracts/constants/AttestationId.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

interface ISafeMintableNFT {
  function safeMint(address to) external;
}

contract LinguaChain is SelfVerificationRoot, Ownable {
  // Your app-specific configuration ID
  bytes32 public configId;

  constructor(
    address _identityVerificationHubV2, // V2 Hub address
    uint256 _scope // Application-specific scope identifier
  ) SelfVerificationRoot(_identityVerificationHubV2, _scope) Ownable(msg.sender) {
    // Initialize with empty configId - set it up in Step 2
  }

  // Required: Override to provide configId for verification
  function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
  ) public view override returns (bytes32) {
    // Replace with your actual config ID from the tool
    return 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
  }

  function setConfigId(bytes32 _configId) external onlyOwner {
    configId = _configId;
  }

  // Override to handle successful verification
  function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
  ) internal virtual override {
    (string memory name, address certificateAddress, address userAddress) = abi.decode(
      userData,
      (string, address, address)
    );

    // Example: Simple verification check
    require(certificateAddress != address(0), 'Incorrect certificate address!');
    require(bytes(output.nationality).length > 0, 'Nationality required!');
    //require(compareStrings(output.name, name), 'User name is not correct!');

    ISafeMintableNFT(certificateAddress).safeMint(userAddress);
  }

  function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }
}
