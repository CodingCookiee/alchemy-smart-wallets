import { useQuery } from "@tanstack/react-query";
import { type Address } from "viem";
import { NFT_MINTABLE_ABI_PARSED } from "@/constants/constants";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

interface UseReadNFTDataParams {
  contractAddress?: Address;
  ownerAddress?: Address;
}

// Create a public client for reading contract data
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  ),
});

export const useReadNFTData = (props: UseReadNFTDataParams) => {
  const { contractAddress, ownerAddress } = props;

  console.log("🔍 useReadNFTData called with:", {
    contractAddress,
    ownerAddress,
  });

  // Query for NFT base URI
  const {
    data: uri,
    isLoading: isLoadingUri,
    error: uriError,
  } = useQuery<string | null, Error, string | null, readonly unknown[]>({
    queryKey: ["nftBaseURI", contractAddress],
    queryFn: async () => {
      console.log("🔍 Fetching NFT base URI...");

      if (!contractAddress) {
        throw new Error(ERROR_MESSAGES.NO_CONTRACT_ADDRESS);
      }

      try {
        const baseUriResult = await publicClient.readContract({
          address: contractAddress,
          abi: NFT_MINTABLE_ABI_PARSED,
          functionName: "baseURI",
        });

        console.log("✅ Base URI fetched:", baseUriResult);
        return (baseUriResult as string) || null; // Ensure we return null instead of undefined
      } catch (error) {
        console.warn(
          "⚠️ baseURI function not available or returned empty, using fallback"
        );
        // Return null instead of undefined to avoid React Query warning
        return null;
      }
    },
    enabled: !!contractAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Reduce retries since this might be expected
  });

  // Query for NFT count/balance
  const {
    data: count,
    isLoading: isLoadingCount,
    error: countError,
    refetch: refetchCount,
  } = useQuery<number, Error, number, readonly unknown[]>({
    queryKey: ["nftBalance", contractAddress, ownerAddress],
    queryFn: async () => {
      console.log("🔍 Fetching NFT balance for:", ownerAddress);

      if (!contractAddress) {
        throw new Error(ERROR_MESSAGES.NO_CONTRACT_ADDRESS);
      }
      if (!ownerAddress) {
        throw new Error(ERROR_MESSAGES.NO_OWNER_ADDRESS);
      }

      try {
        const balance = await publicClient.readContract({
          address: contractAddress,
          abi: NFT_MINTABLE_ABI_PARSED,
          functionName: "balanceOf",
          args: [ownerAddress],
        });

        const balanceNumber = Number(balance);
        console.log("✅ NFT balance fetched:", balanceNumber);
        return balanceNumber;
      } catch (error) {
        console.error("❌ Error fetching NFT balance:", error);
        // Return 0 as fallback instead of throwing
        console.warn("⚠️ Returning 0 as fallback balance");
        return 0;
      }
    },
    enabled: !!contractAddress && !!ownerAddress,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });

  return {
    uri: uri || undefined, // Convert null back to undefined for component usage
    count: count ?? 0, // Provide fallback
    isLoading: isLoadingUri || isLoadingCount,
    isLoadingUri,
    isLoadingCount,
    error: countError, // Only show count errors, not URI errors
    uriError,
    countError,
    refetchCount,
  };
};
