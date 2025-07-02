import { parseAbi } from "viem";


// Your thirdweb deployed contract address - this should work with claim function
export const NFT_CONTRACT_ADDRESS = "0x615e6FeE07312214eb4E570062fe60943F0D7892"; 


export const NFT_MINTABLE_ABI_PARSED = parseAbi([
  // Your thirdweb contract's actual mint function
  "function mint(address to, uint256 amount, string baseURI, bytes data) payable",
  
  // Role management functions
  "function owner() view returns (address)",
  "function rolesOf(address user) view returns (uint256)",
  "function grantRoles(address user, uint256 roles) payable",
  "function hasAllRoles(address user, uint256 roles) view returns (bool)",
  
  // View functions
  "function balanceOf(address owner) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokensOfOwner(address owner) view returns (uint256[])",
] as const);


export const NFT_METADATA = {
  name: "Smart Wallet NFT Collection",
  description: "Gasless minting • Account Abstraction powered",
  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format",
  placeholderImage: "https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Loading...",
};
