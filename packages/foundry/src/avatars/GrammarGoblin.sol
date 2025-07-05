// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.28;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract GrammarGoblin is ERC721, Ownable {
  uint256 private _nextTokenId;

  constructor(address initialOwner) ERC721('Grammar Goblin', 'Grammar Goblin') Ownable(initialOwner) {}

  function _baseURI() internal pure override returns (string memory) {
    return 'https://hackathon.omerharuncetin.com/api/nft/grammar-goblin/';
  }

  function safeMint(address to) public onlyOwner returns (uint256) {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    return tokenId;
  }
}
