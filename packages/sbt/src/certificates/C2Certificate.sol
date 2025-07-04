// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "../../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract LinguaC2Certificate is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor()
        ERC721("C2 Certificate", "C2Cert")
        Ownable()
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://hackathon.omerharuncetin.com/api/certificates/c2/";
    }

    function safeMint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    // ----------- Disable transfers ------------------

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // Only allow minting (from 0) and burning (to 0)
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: tokens are non-transferable");
        }
    }
}
