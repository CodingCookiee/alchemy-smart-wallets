"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import {
  NFT_CONTRACT_ADDRESS,
  NFT_MINTABLE_ABI_PARSED,
} from "@/constants/constants";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  ),
});

export default function ContractDebug() {
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkContract = async () => {
      try {
        console.log("🔍 Checking contract:", NFT_CONTRACT_ADDRESS);

        const results = await Promise.allSettled([
          publicClient.readContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_MINTABLE_ABI_PARSED,
            functionName: "name",
          }),
          publicClient.readContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_MINTABLE_ABI_PARSED,
            functionName: "symbol",
          }),
          publicClient.readContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_MINTABLE_ABI_PARSED,
            functionName: "totalSupply",
          }),
          publicClient.getCode({ address: NFT_CONTRACT_ADDRESS }),
        ]);

        const info = {
          name: results[0].status === "fulfilled" ? results[0].value : "N/A",
          symbol: results[1].status === "fulfilled" ? results[1].value : "N/A",
          totalSupply:
            results[2].status === "fulfilled"
              ? results[2].value?.toString()
              : "N/A",
          hasCode:
            results[3].status === "fulfilled" && results[3].value !== "0x",
          errors: results
            .map((r, i) =>
              r.status === "rejected" ? `Function ${i}: ${r.reason}` : null
            )
            .filter(Boolean),
        };

        setContractInfo(info);
        console.log("📊 Contract info:", info);
      } catch (error) {
        console.error("❌ Contract check failed:", error);
        setContractInfo({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    checkContract();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Checking contract...</div>;
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
      <h4 className="font-semibold mb-2">Contract Debug Info:</h4>
      <div className="space-y-1">
        <p>
          <strong>Address:</strong> {NFT_CONTRACT_ADDRESS}
        </p>
        {contractInfo?.error ? (
          <p className="text-red-600">
            <strong>Error:</strong> {contractInfo.error}
          </p>
        ) : (
          <>
            <p>
              <strong>Has Code:</strong> {contractInfo?.hasCode ? "✅" : "❌"}
            </p>
            <p>
              <strong>Name:</strong> {contractInfo?.name}
            </p>
            <p>
              <strong>Symbol:</strong> {contractInfo?.symbol}
            </p>
            <p>
              <strong>Total Supply:</strong> {contractInfo?.totalSupply}
            </p>
            {contractInfo?.errors?.length > 0 && (
              <div className="text-red-600">
                <strong>Errors:</strong>
                {contractInfo.errors.map((error: string, i: number) => (
                  <div key={i}>• {error}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
