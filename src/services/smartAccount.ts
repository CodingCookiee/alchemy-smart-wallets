import { WalletClientSigner, type SmartAccountSigner } from "@aa-sdk/core";
import { createWalletClient, custom } from "viem";
import { createLightAccount } from "@account-kit/smart-contracts";
import { alchemy, defineAlchemyChain } from "@account-kit/infra";
import { sepolia } from "viem/chains";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is required");
}

// Define the Alchemy chain with proper RPC URL
const alchemySepoliaChain = defineAlchemyChain({
  chain: sepolia,
  rpcBaseUrl: "https://eth-sepolia.g.alchemy.com/v2",
});

export interface SmartAccountResult {
  account: any;
  signer: SmartAccountSigner;
  address: string;
}

export async function createSmartAccountFromEOA(): Promise<SmartAccountResult | null> {
  console.log("🚀 Starting smart account creation process...");
  
  try {
    // Ensure we're in the browser
    if (typeof window === 'undefined') {
      throw new Error("This function can only be called in the browser");
    }

    console.log("✅ Browser environment confirmed");

    // Check if MetaMask is available
    if (!window.ethereum) {
      throw new Error("MetaMask not detected. Please install MetaMask to continue.");
    }

    console.log("✅ MetaMask detected");

    // Request account access
    console.log("🔐 Requesting account access...");
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please connect your MetaMask wallet.");
    }

    console.log("✅ Accounts found:", accounts);

    // Create wallet client from MetaMask provider using the proper chain
    console.log("🔧 Creating wallet client...");
    const walletClient = createWalletClient({
      chain: alchemySepoliaChain, // Use the Alchemy-configured chain
      transport: custom(window.ethereum),
    });

    console.log("✅ Wallet client created");

    // Create signer from wallet client
    console.log("🔧 Creating signer...");
    const signer: SmartAccountSigner = new WalletClientSigner(
      walletClient,
      "json-rpc"
    );

    console.log("✅ Signer created");

    // Create Alchemy transport
    console.log("🔧 Creating Alchemy transport...");
    const alchemyTransport = alchemy({ apiKey: API_KEY });

    console.log("✅ Alchemy transport created");

    // Try using createLightAccount instead
    console.log("🔧 Creating light account...");
    const account = await createLightAccount({
      chain: alchemySepoliaChain,
      transport: alchemyTransport,
      signer: signer,
    });

    console.log("✅ Light account created");
    console.log("🔍 Account object:", account);
    console.log("🔍 Account methods:", Object.getOwnPropertyNames(account));

    console.log("🔧 Getting account address...");
    let address: string;
    
    // Try different ways to get the address
    if (typeof account.getAddress === 'function') {
      address = await account.getAddress();
    } else if (typeof account.address === 'string') {
      address = account.address;
    } else if (account.account && typeof account.account.address === 'string') {
      address = account.account.address;
    } else {
      console.error("❌ Cannot find address property on account:", account);
      throw new Error("Unable to get smart account address");
    }

    console.log("✅ Smart account created successfully!");
    console.log("📍 Smart account address:", address);

    return {
      account,
      signer,
      address,
    };
  } catch (error) {
    console.error("❌ Error creating smart account from EOA:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new Error("Transaction was rejected. Please try again and approve the transaction.");
      } else if (error.message.includes('insufficient funds')) {
        throw new Error("Insufficient funds to create smart account. Please add some ETH to your wallet.");
      } else if (error.message.includes('network')) {
        throw new Error("Network error. Please check your connection and try again.");
      }
    }
    
    throw error; // Re-throw to let the UI handle it
  }
}

export async function getEOAAddress(): Promise<string | null> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    
    const address = accounts[0] || null;
    console.log("EOA Address retrieved:", address);
    return address;
  } catch (error) {
    console.error("Error getting EOA address:", error);
    return null;
  }
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}
