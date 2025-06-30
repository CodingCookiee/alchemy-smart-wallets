import { WalletClientSigner, type SmartAccountSigner } from "@aa-sdk/core";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
import { createModularAccountV2 } from "@account-kit/smart-contracts";
import { alchemy } from "@account-kit/infra";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is required");
}

export interface SmartAccountResult {
  account: any;
  signer: SmartAccountSigner;
  address: string;
}

export async function createSmartAccountFromEOA(): Promise<SmartAccountResult | null> {
  try {
    // Check if MetaMask is available
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create wallet client from MetaMask provider
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    // Create signer from wallet client
    const signer: SmartAccountSigner = new WalletClientSigner(
      walletClient,
      "json-rpc"
    );

    // Create Alchemy transport
    const alchemyTransport = alchemy({ apiKey: API_KEY });

    // Create smart account with EOA as owner
    const account = await createModularAccountV2({
      chain: sepolia,
      transport: alchemyTransport,
      signer: signer, // EOA becomes the owner/signer
    });

    const address = await account.getAddress();

    return {
      account,
      signer,
      address,
    };
  } catch (error) {
    console.error("Error creating smart account from EOA:", error);
    return null;
  }
}

export async function getEOAAddress(): Promise<string | null> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting EOA address:", error);
    return null;
  }
}
