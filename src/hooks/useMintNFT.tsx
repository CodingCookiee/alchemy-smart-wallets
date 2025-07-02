import { useCallback, useMemo, useState } from "react";
import {
  useSmartAccountClient,
  useSendUserOperation,
} from "@account-kit/react";
import { encodeFunctionData, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import {
  NFT_MINTABLE_ABI_PARSED,
  NFT_CONTRACT_ADDRESS,
} from "@/constants/constants";

const ERROR_MESSAGES = {
  USER_REJECTED: "Transaction was rejected by user",
  INSUFFICIENT_FUNDS: "Insufficient funds for transaction",
  NETWORK_ERROR: "Network error occurred, please try again",
  EXECUTION_REVERTED: "Transaction failed during execution",
  NO_SMART_ACCOUNT: "No smart account connected",
};

export interface UseMintNFTParams {
  onSuccess?: () => void;
}

export interface UseMintReturn {
  isMinting: boolean;
  handleMint: () => void;
  transactionUrl?: string;
  error?: string;
}

// Create a public client for contract checks
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  ),
});

export const useMint = ({ onSuccess }: UseMintNFTParams): UseMintReturn => {
  const [error, setError] = useState<string>();
  const [workingContract, setWorkingContract] = useState<string>(NFT_CONTRACT_ADDRESS);
  
  // Use the standard Alchemy hook with LightAccount type
  const { client } = useSmartAccountClient({ type: "LightAccount" });

  console.log("🔍 useMint - client:", !!client);
  console.log("🔍 useMint - client address:", client?.getAddress());

  const handleSuccess = useCallback(() => {
    console.log("✅ Mint successful!");
    setError(undefined);
    onSuccess?.();
  }, [onSuccess]);

  const handleError = useCallback((error: Error) => {
    console.error("❌ Mint error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = error.message || "Failed to mint NFT";
    
    if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
      errorMessage = ERROR_MESSAGES.USER_REJECTED;
    } else if (errorMessage.includes('insufficient funds')) {
      errorMessage = ERROR_MESSAGES.INSUFFICIENT_FUNDS;
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (errorMessage.includes('execution reverted')) {
      errorMessage = ERROR_MESSAGES.EXECUTION_REVERTED;
    }
    
    setError(errorMessage);
  }, []);

  const { sendUserOperationResult, sendUserOperation, isSendingUserOperation } =
    useSendUserOperation({
      client,
      waitForTxn: true,
      onSuccess: handleSuccess,
      onError: handleError,
      onMutate: () => {
        console.log("🎨 Starting NFT mint process...");
        setError(undefined);
      },
    });

  // Function to find a working contract
  const findWorkingContract = useCallback(async () => {
    const contractsToTry = [NFT_CONTRACT_ADDRESS];
    
    for (const contractAddress of contractsToTry) {
      try {
        console.log(`🔍 Testing contract: ${contractAddress}`);
        
        // Check if contract has code
        const code = await publicClient.getCode({ address: contractAddress as `0x${string}` });
        if (!code || code === '0x') {
          console.log(`❌ Contract ${contractAddress} has no code`);
          continue;
        }
        
        // Try to read basic info
        const name = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: NFT_MINTABLE_ABI_PARSED,
          functionName: "name",
        });
        
        console.log(`✅ Found working contract: ${contractAddress} (${name})`);
        setWorkingContract(contractAddress);
        return contractAddress;
      } catch (error) {
        console.log(`❌ Contract ${contractAddress} failed:`, error);
        continue;
      }
    }
    
    throw new Error("No working NFT contract found");
  }, []);

  // Function to check and potentially grant minting roles
  const checkAndGrantRoles = useCallback(async (contractAddress: string, clientAddress: string) => {
    try {
      // Check if user already has minting roles
      const currentRoles = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: NFT_MINTABLE_ABI_PARSED,
        functionName: "rolesOf",
        args: [clientAddress],
      });

      console.log(`🔍 Current roles for ${clientAddress}:`, currentRoles);

      // If no roles (0n), try to grant MINTER_ROLE (typically role 1 = 2^0)
      if (currentRoles === 0n) {
        console.log("🔧 Attempting to grant MINTER_ROLE...");
        
        // Check if the current account is the owner or has admin roles
        const ownerAddress = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: NFT_MINTABLE_ABI_PARSED,
          functionName: "owner",
        });

        console.log(`📋 Contract owner: ${ownerAddress}`);
        console.log(`📋 Your address: ${clientAddress}`);

        if (ownerAddress.toLowerCase() === clientAddress.toLowerCase()) {
          console.log("✅ You are the owner! Attempting to grant MINTER_ROLE to yourself...");
          
          // MINTER_ROLE is typically 1 (2^0)
          const MINTER_ROLE = 1n;
          
          // This would need to be called via sendUserOperation
          throw new Error("🔧 As the contract owner, you need to grant yourself MINTER_ROLE. Please use the thirdweb dashboard or call grantRoles function.");
        } else {
          throw new Error(`❌ You need minting permissions. Contract owner (${ownerAddress}) must grant MINTER_ROLE to your smart account (${clientAddress}).`);
        }
      }

      return true;
    } catch (error) {
      console.log("❌ Error checking roles:", error);
      // Re-throw the error to show user what they need to do
      throw error;
    }
  }, []);

  // Function to detect which mint function is available
  const detectMintFunction = useCallback(async (contractAddress: string, clientAddress: string) => {
    // First check roles
    await checkAndGrantRoles(contractAddress, clientAddress);

    const mintFunctions = [
      // Try simple mint without baseURI - thirdweb often allows this
      { 
        name: "mint", 
        args: [
          clientAddress, // to address
          1, // amount (quantity to mint)
          "", // empty baseURI - let contract handle it
          "0x" // empty data bytes
        ] 
      },
    ];
    
    for (const config of mintFunctions) {
      try {
        console.log(`🔍 Trying function: ${config.name} with args:`, config.args);
        
        // Try to simulate the call first
        await publicClient.simulateContract({
          address: contractAddress as `0x${string}`,
          abi: NFT_MINTABLE_ABI_PARSED,
          functionName: config.name as any,
          args: config.args as any,
          account: clientAddress as `0x${string}`,
          value: 0n, // No payment required for mint
        });
        
        console.log(`✅ Function ${config.name} is available`);
        return { name: config.name, args: config.args };
      } catch (error) {
        console.log(`❌ Function ${config.name} failed:`, error);
        
        // If unauthorized, provide helpful error message
        if (error?.message?.includes("0x00000000") || error?.message?.includes("Unauthorized")) {
          throw new Error("❌ Unauthorized to mint. The contract owner needs to grant minting permissions to your smart account address: " + clientAddress);
        }
        continue;
      }
    }
    
    throw new Error("No compatible mint function found on this contract");
  }, [checkAndGrantRoles]);

  const handleMint = useCallback(async () => {
    if (!client) {
      setError(ERROR_MESSAGES.NO_SMART_ACCOUNT);
      return;
    }

    try {
      const clientAddress = client.getAddress();
      console.log("📍 Minting to address:", clientAddress);

      // First, find a working contract
      const contractAddress = await findWorkingContract();
      console.log("📍 Using contract address:", contractAddress);

      // Detect the correct mint function
      const mintFunction = await detectMintFunction(contractAddress, clientAddress);
      
      const callData = encodeFunctionData({
        abi: NFT_MINTABLE_ABI_PARSED,
        functionName: mintFunction.name as any,
        args: mintFunction.args as any,
      });

      console.log("🔧 Using function:", mintFunction.name);
      console.log("🔧 Function args:", mintFunction.args);
      console.log("🔧 Encoded call data:", callData);

      sendUserOperation({
        uo: {
          target: contractAddress as `0x${string}`,
          data: callData,
        },
      });
    } catch (err) {
      console.error("❌ Error preparing mint transaction:", err);
      handleError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    }
  }, [client, sendUserOperation, handleError, findWorkingContract, detectMintFunction]);

  const transactionUrl = useMemo(() => {
    if (!sendUserOperationResult?.hash) {
      return undefined;
    }
    return `https://sepolia.etherscan.io/tx/${sendUserOperationResult.hash}`;
  }, [sendUserOperationResult?.hash]);

  return {
    isMinting: isSendingUserOperation,
    handleMint,
    transactionUrl,
    error,
  };
};
