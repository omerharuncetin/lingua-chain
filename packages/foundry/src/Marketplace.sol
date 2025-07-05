// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IMintableNFT {
  function mint(address to) external;
}

contract MultiNFTMarketplace {
  IERC20 public immutable usdc;
  address public owner;

  // Map index (0 to 5) to NFT contract address
  mapping(uint256 => address) public nftContracts;
  // Price per NFT contract
  mapping(uint256 => uint256) public prices;
  // Track if NFT is available for sale
  mapping(uint256 => bool) public available;

  event Purchased(address indexed buyer, uint256 indexed nftIndex, uint256 price);
  event NFTContractSet(uint256 indexed index, address nftAddress);
  event PriceSet(uint256 indexed index, uint256 price);
  event Removed(uint256 indexed index);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Not owner');
    _;
  }

  constructor(address _usdc) {
    usdc = IERC20(_usdc);
    owner = msg.sender;
  }

  // Set NFT contract address (index 0 to 5)
  function setNFTContract(uint256 index, address nftAddress) external onlyOwner {
    require(index >= 0 && index < 5, 'Index must be 0-5');
    require(nftAddress != address(0), 'Invalid NFT address');

    nftContracts[index] = nftAddress;
    available[index] = true;

    emit NFTContractSet(index, nftAddress);
  }

  // Set price for NFT contract index
  function setPrice(uint256 index, uint256 price) external onlyOwner {
    require(index >= 0 && index < 5, 'Index must be 0-5');
    require(price > 0, 'Price must be > 0');

    prices[index] = price;
    available[index] = true;

    emit PriceSet(index, price);
  }

  // Remove NFT contract from sale
  function removeNFT(uint256 index) external onlyOwner {
    require(index >= 0 && index < 5, 'Index must be 0-5');

    available[index] = false;
    prices[index] = 0;

    emit Removed(index);
  }

  function buy(uint256 index) external {
    require(index >= 0 && index < 5, 'Index must be 0-5');
    require(available[index], 'NFT not available');

    uint256 price = prices[index];
    require(price > 0, 'Price not set');

    address nftAddress = nftContracts[index];
    require(nftAddress != address(0), 'NFT contract not set');

    // Transfer USDC from buyer to owner
    require(usdc.transferFrom(msg.sender, owner, price), 'USDC transfer failed');

    // Mint NFT to buyer
    IMintableNFT(nftAddress).mint(msg.sender);

    // If NFTs are single edition per contract, mark unavailable after purchase
    // Uncomment if needed:
    // available[index] = false;

    emit Purchased(msg.sender, index, price);
  }
}
