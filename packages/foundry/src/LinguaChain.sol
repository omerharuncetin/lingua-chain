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
    return configId;
  }

  function setConfigId(bytes32 _configId) external onlyOwner {
    configId = _configId;
  }

  function setScope(uint256 _scopeId) external onlyOwner {
    _scope = _scopeId;
  }

  // Override to handle successful verification
  function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
  ) internal virtual override {
    address certificateAddress = decodeToAddress(userData);
    address recipient = address(uint160(output.userIdentifier));

    // Example: Simple verification check
    require(certificateAddress != address(0), 'Incorrect certificate address!');
    require(bytes(output.nationality).length > 0, 'Nationality required!');
    //require(compareStrings(output.name, name), 'User name is not correct!');

    ISafeMintableNFT(certificateAddress).safeMint(recipient);
  }

  /**
   * @dev Farklı formatlardaki address verilerini decode eder
   * Desteklenen formatlar:
   * 1. ASCII hex encoded (80 byte): "33633362..."
   * 2. Direkt hex string (40 byte): "3c3b2cb2..."
   * 3. 0x prefix'li hex string (42 byte): "0x3c3b2cb2..."
   * 4. Packed address (20 byte): gerçek address bytes
   */
  function decodeToAddress(bytes memory data) public pure returns (address) {
    uint256 len = data.length;

    // Format 1: 20 byte - direkt address
    if (len == 20) {
      return bytesToAddress(data);
    }

    // Format 2: 40 byte - hex string (0x'siz)
    if (len == 40) {
      return parseHexString(data);
    }

    // Format 3: 42 byte - 0x prefix'li hex string
    if (len == 42 && data[0] == 0x30 && data[1] == 0x78) {
      // '0x'
      bytes memory withoutPrefix = new bytes(40);
      for (uint i = 0; i < 40; i++) {
        withoutPrefix[i] = data[i + 2];
      }
      return parseHexString(withoutPrefix);
    }

    // Format 4: 80 byte - ASCII hex encoded
    if (len == 80) {
      return decodeAsciiHex(data);
    }

    revert('Unsupported format');
  }

  /**
   * @dev 20 byte'lık veriyi direkt address'e çevirir
   */
  function bytesToAddress(bytes memory b) private pure returns (address) {
    require(b.length == 20, 'Invalid address length');
    address addr;
    assembly {
      addr := mload(add(b, 20))
    }
    return addr;
  }

  /**
   * @dev 40 karakterlik hex string'i address'e çevirir
   */
  function parseHexString(bytes memory hexStr) private pure returns (address) {
    require(hexStr.length == 40, 'Invalid hex string length');

    uint160 addr = 0;
    for (uint256 i = 0; i < 40; i++) {
      uint8 digit = hexCharToUint8(hexStr[i]);
      addr = addr * 16 + digit;
    }

    return address(addr);
  }

  /**
   * @dev ASCII hex encoded veriyi decode eder
   */
  function decodeAsciiHex(bytes memory encoded) private pure returns (address) {
    require(encoded.length == 80, 'Invalid ASCII hex length');

    bytes memory decoded = new bytes(40);

    for (uint256 i = 0; i < 80; i += 2) {
      uint8 high = hexCharToUint8(encoded[i]);
      uint8 low = hexCharToUint8(encoded[i + 1]);
      decoded[i / 2] = bytes1((high << 4) | low);
    }

    return parseHexString(decoded);
  }

  /**
   * @dev Hex karakteri sayıya çevirir
   */
  function hexCharToUint8(bytes1 c) private pure returns (uint8) {
    if (c >= 0x30 && c <= 0x39) {
      return uint8(c) - 0x30; // '0'-'9'
    } else if (c >= 0x61 && c <= 0x66) {
      return 10 + uint8(c) - 0x61; // 'a'-'f'
    } else if (c >= 0x41 && c <= 0x46) {
      return 10 + uint8(c) - 0x41; // 'A'-'F'
    } else {
      revert('Invalid hex character');
    }
  }

  function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }
}
