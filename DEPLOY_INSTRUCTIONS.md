# How to Deploy Your NFT Contract

## Option 1: Using Thirdweb (Easiest)

1. Go to [thirdweb.com](https://thirdweb.com/explore)
2. Select "NFT Drop" or "NFT Collection"
3. Connect your wallet
4. Choose Sepolia testnet
5. Fill in contract details:
   - Name: "Smart Wallet NFT Collection"
   - Symbol: "SWNFT"
   - Description: "Gasless minting • Account Abstraction powered"
6. Deploy the contract
7. Copy the contract address and replace in `src/constants/constants.ts`

## Option 2: Using Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file `SimpleNFT.sol` and paste the content from `contracts/SimpleNFT.sol`
3. Install OpenZeppelin contracts:
   - Go to File Explorer > .deps > npm
   - Install `@openzeppelin/contracts`
4. Compile the contract
5. Deploy to Sepolia testnet:
   - Connect your wallet (MetaMask)
   - Select Sepolia network
   - Deploy with constructor args:
     - name: "Smart Wallet NFT Collection"
     - symbol: "SWNFT"  
     - baseTokenURI: "https://example.com/metadata/"
6. Copy the deployed contract address and replace in `src/constants/constants.ts`

## Option 3: Using Foundry (Detailed Step-by-Step)

### Prerequisites
- Windows computer with WSL2 installed (for Linux commands)
- MetaMask wallet with some Sepolia ETH
- Your Alchemy API key

### Step 1: Install Foundry
Open Command Prompt or PowerShell as Administrator and run:
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Restart your terminal and run:
foundryup
```

### Step 2: Set up the project
```bash
# Create new directory
mkdir nft-contract
cd nft-contract

# Initialize Foundry project
forge init --force

# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts
```

### Step 3: Create the contract
Replace the contents of `src/Counter.sol` with this SimpleNFT contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721, Ownable {
    uint256 private _currentTokenId = 0;
    string private _baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    function mintTo(address to) public returns (uint256) {
        uint256 newTokenId = _getNextTokenId();
        _mint(to, newTokenId);
        _incrementTokenId();
        return newTokenId;
    }

    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId + 1;
    }

    function _incrementTokenId() private {
        _currentTokenId++;
    }

    function baseURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
```

### Step 4: Compile the contract
```bash
forge build
```

### Step 5: Set up environment variables
Create a `.env` file in your project root:
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_wallet_private_key_here
```

**⚠️ SECURITY WARNING**: Never commit your private key to git!

### Step 6: Deploy the contract
```bash
# Load environment variables
source .env

# Deploy the contract
forge create --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  src/Counter.sol:SimpleNFT \
  --constructor-args "Smart Wallet NFT Collection" "SWNFT" "https://api.example.com/metadata/"
```

### Step 7: Verify on Etherscan (Optional)
```bash
forge verify-contract \
  --chain-id 11155111 \
  --num-of-optimizations 200 \
  --watch \
  --constructor-args $(cast abi-encode "constructor(string,string,string)" "Smart Wallet NFT Collection" "SWNFT" "https://api.example.com/metadata/") \
  --etherscan-api-key YOUR_ETHERSCAN_API_KEY \
  --compiler-version v0.8.19+commit.7dd6d404 \
  CONTRACT_ADDRESS_FROM_DEPLOYMENT \
  src/Counter.sol:SimpleNFT
```

### Step 8: Update your app
Copy the deployed contract address and update `src/constants/constants.ts`:
```typescript
export const NFT_CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
```

## Quick Test Contract (For immediate testing)

If you want to test immediately, you can use this deployed test contract:
- **Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Network**: Sepolia
- **Functions**: `mintTo(address)`, `balanceOf(address)`, `tokenURI(uint256)`

Replace the address in `src/constants/constants.ts`:
```typescript
export const NFT_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
```

## Verify It's Working

After deploying/using a contract:
1. Check the contract on [Sepolia Etherscan](https://sepolia.etherscan.io)
2. Verify it has the required functions: `mintTo`, `balanceOf`, `name`
3. Test minting through your app
