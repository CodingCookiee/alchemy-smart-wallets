import { useCallback } from "react";
import { useSmartAccountClient, useSendUserOperation } from "@account-kit/react";
import { encodeFunctionData } from "viem";
import { NFT_MINTABLE_ABI_PARSED, NFT_CONTRACT_ADDRESS } from "@/constants/constants";

export const useGrantRoles = () => {
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: () => {
      console.log("✅ Roles granted successfully!");
    },
    onError: (error) => {
      console.error("❌ Error granting roles:", error);
    },
  });

  const grantMinterRole = useCallback(async (targetAddress: string) => {
    if (!client) {
      throw new Error("No smart account connected");
    }

    try {
      const MINTER_ROLE = 1n; // 2^0 = 1, typically the minter role

      const callData = encodeFunctionData({
        abi: NFT_MINTABLE_ABI_PARSED,
        functionName: "grantRoles",
        args: [targetAddress, MINTER_ROLE],
      });

      console.log(`🔧 Granting MINTER_ROLE to: ${targetAddress}`);

      sendUserOperation({
        uo: {
          target: NFT_CONTRACT_ADDRESS as `0x${string}`,
          data: callData,
        },
      });
    } catch (error) {
      console.error("❌ Error preparing grant roles transaction:", error);
      throw error;
    }
  }, [client, sendUserOperation]);

  return {
    grantMinterRole,
    isGrantingRoles: isSendingUserOperation,
  };
};
