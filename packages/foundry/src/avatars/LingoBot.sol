// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.28;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract LingoBot is ERC721, Ownable {
  uint256 private _nextTokenId;

  address marketplaceContract;

  modifier ownerOrMarketPlaceContract() {
    require(_msgSender() == owner() || _msgSender() == marketplaceContract, 'Authorized!');
    _;
  }

  function setMarketplaceContract(address marketplaceContract_) external onlyOwner {
    marketplaceContract = marketplaceContract_;
  }

  constructor() ERC721('LingoBot', 'LingoBot') Ownable(msg.sender) {}

  function _baseURI() internal pure override returns (string memory) {
    return 'https://hackathon.omerharuncetin.com/api/nft/avatars/lingobot/';
  }

  function safeMint(address to) public ownerOrMarketPlaceContract returns (uint256) {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    return tokenId;
  }
}
