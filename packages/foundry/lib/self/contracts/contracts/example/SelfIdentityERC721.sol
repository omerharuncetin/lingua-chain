// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {ISelfVerificationRoot} from "../interfaces/ISelfVerificationRoot.sol";
import {AttestationId} from "../constants/AttestationId.sol";
import {CircuitAttributeHandlerV2} from "../libraries/CircuitAttributeHandlerV2.sol";

import {SelfVerificationRoot} from "../abstract/SelfVerificationRoot.sol";

/**
 * @title SelfIdentityERC721 V2
 * @notice This contract issues ERC721 tokens based on verified identity credentials supporting both E-Passport and EUID cards
 * @dev Inherits from SelfVerificationRoot V2 for verification logic and ERC721 for NFT functionality
 */
contract SelfIdentityERC721 is SelfVerificationRoot, ERC721, Ownable {
    // ====================================================
    // Storage Variables
    // ====================================================

    /// @notice Counter for token IDs
    uint256 private _tokenIdCounter;

    /// @notice Mapping from token ID to identity attributes
    mapping(uint256 tokenId => ISelfVerificationRoot.GenericDiscloseOutputV2 identityAttributes)
        private _identityAttributes;

    /// @notice Mapping to track minted user identifiers to prevent double minting
    mapping(uint256 userIdentifier => bool minted) private _mintedUserIdentifiers;

    // ====================================================
    // Events
    // ====================================================

    event IdentityNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 attestationId,
        ISelfVerificationRoot.GenericDiscloseOutputV2 attributes
    );

    // ====================================================
    // Errors
    // ====================================================

    error UserIdentifierAlreadyMinted();
    error InvalidUserIdentifier();

    // ====================================================
    // Constructor
    // ====================================================

    /**
     * @notice Constructor for the SelfIdentityERC721 V2 contract
     * @param identityVerificationHubAddress The address of the Identity Verification Hub V2
     * @param scopeValue The expected proof scope for user registration
     * @param name The name of the NFT collection
     * @param symbol The symbol of the NFT collection
     */
    constructor(
        address identityVerificationHubAddress,
        uint256 scopeValue,
        string memory name,
        string memory symbol
    ) SelfVerificationRoot(identityVerificationHubAddress, scopeValue) ERC721(name, symbol) Ownable(_msgSender()) {}

    // ====================================================
    // External/Public Functions
    // ====================================================

    /**
     * @notice Updates the scope used for verification
     * @dev Only callable by the contract owner
     * @param newScope The new scope to set
     */
    function setScope(uint256 newScope) external onlyOwner {
        _setScope(newScope);
    }

    /**
     * @notice Get identity attributes for a specific token ID
     * @param tokenId The token ID to query
     * @return The identity attributes associated with the token
     */
    function getIdentityAttributes(
        uint256 tokenId
    ) external view returns (ISelfVerificationRoot.GenericDiscloseOutputV2 memory) {
        require(_exists(tokenId), "Token does not exist");
        return _identityAttributes[tokenId];
    }

    /**
     * @notice Check if a user identifier has already minted an NFT
     * @param userIdentifier The user identifier to check
     * @return True if the user identifier has already minted, false otherwise
     */
    function isUserIdentifierMinted(uint256 userIdentifier) external view returns (bool) {
        return _mintedUserIdentifiers[userIdentifier];
    }

    /**
     * @notice Get the current scope value
     * @return The current scope value
     */
    function getScope() external view returns (uint256) {
        return _scope;
    }

    // ====================================================
    // Override Functions from SelfVerificationRoot
    // ====================================================

    /**
     * @notice Hook called after successful verification - handles NFT minting
     * @dev Validates user identifier and mints identity NFT with extracted attributes for both E-Passport and EUID
     * @param output The verification output containing user data
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory /* userData */
    ) internal override {
        // Check if user identifier is valid
        if (output.userIdentifier == 0) {
            revert InvalidUserIdentifier();
        }

        // Check if user identifier has already minted an NFT
        if (_mintedUserIdentifiers[output.userIdentifier]) {
            revert UserIdentifierAlreadyMinted();
        }

        // Mint NFT
        uint256 tokenId = _tokenIdCounter++;
        _mint(msg.sender, tokenId);
        _identityAttributes[tokenId] = output;
        _mintedUserIdentifiers[output.userIdentifier] = true;

        emit IdentityNFTMinted(tokenId, msg.sender, output.attestationId, output);
    }

    // ====================================================
    // Internal Functions
    // ====================================================

    /**
     * @notice Check if a token exists
     * @param tokenId The token ID to check
     * @return True if the token exists, false otherwise
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
