// src/constants/constants.ts
import { parseAbi } from "viem";

export const NFT_CONTRACT_ADDRESS = "0x6D1BaA7951f26f600b4ABc3a9CF8F18aBf36fac1";


export const NFT_MINTABLE_ABI_PARSED = parseAbi([
  "function mintTo(address recipient) returns (uint256)",
  "function baseURI() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
] as const);


export const NFT_METADATA = {
  name: "Smart Wallet NFT Collection",
  description: "Gasless minting • Account Abstraction powered",
  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format",
  placeholderImage: "https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Loading...",
};
