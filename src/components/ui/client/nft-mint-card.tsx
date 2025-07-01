import { useState, useEffect } from "react";
import {
  ExternalLink,
  Loader2,
  PlusCircle,
  ImageIcon,
  CheckCircle,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui/common";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSmartAccountClient } from "@account-kit/react";
import { useReadNFTData } from "@/hooks/useReadNFTData";
import { useMint } from "@/hooks/useMintNFT";
import { NFT_CONTRACT_ADDRESS, NFT_METADATA } from "@/constants/constants";
import ContractDebug from "@/components/ui/client/contract-debug";

export default function NftMintCard() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(NFT_METADATA.image);
  const [showDebug, setShowDebug] = useState(false);

  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const smartAccountAddress = client?.getAddress();

  console.log("🔍 NftMintCard - client:", !!client);
  console.log("🔍 NftMintCard - smartAccountAddress:", smartAccountAddress);

  // Use real hooks for NFT data and minting
  const {
    uri,
    count,
    isLoading: isLoadingCount,
    refetchCount,
    error: dataError,
  } = useReadNFTData({
    contractAddress: NFT_CONTRACT_ADDRESS,
    ownerAddress: smartAccountAddress,
  });

  const { isMinting, handleMint, transactionUrl, error } = useMint({
    onSuccess: () => {
      console.log("✅ NFT minted successfully!");
      refetchCount(); // Refresh the NFT count
    },
  });

  // Update image URL when URI is fetched
  useEffect(() => {
    if (uri && !imageError) {
      setCurrentImageUrl(uri);
    }
  }, [uri, imageError]);

  // Reset success animation when new transaction appears
  useEffect(() => {
    if (transactionUrl) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [transactionUrl]);

  // Handle image loading errors with fallbacks
  const handleImageError = () => {
    console.warn("Failed to load NFT image:", currentImageUrl);
    setIsImageLoading(false);

    if (currentImageUrl === NFT_METADATA.image) {
      // If main image fails, try placeholder
      setCurrentImageUrl(NFT_METADATA.placeholderImage);
      setImageError(false);
      setIsImageLoading(true);
    } else if (currentImageUrl === NFT_METADATA.placeholderImage) {
      // If placeholder fails, show error state
      setImageError(true);
    } else {
      // If URI fails, try main image
      setCurrentImageUrl(NFT_METADATA.image);
      setImageError(false);
      setIsImageLoading(true);
    }
  };

  // Show loading state if smart account client is not available
  if (!client || !smartAccountAddress) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="mb-2">NFT Minting</CardTitle>
          <CardDescription>
            Smart account required for NFT minting...
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg">
            <div className="text-center space-y-2">
              <Wallet className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-500">
                Waiting for smart account...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nftCount = count || 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="mb-2">
              Mint NFT with Gas Sponsorship
            </CardTitle>
            <CardDescription>
              Mint NFTs using your smart account with sponsored gas fees.
              Experience the power of Account Abstraction!
            </CardDescription>
          </div>
          <Badge
            className="ml-2 px-4 py-2 flex items-center justify-center whitespace-nowrap text-lg font-semibold"
            variant="outline"
          >
            {isLoadingCount ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `${nftCount} NFTs`
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border">
          {isImageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary/40" />
              </div>
            </div>
          )}

          <div className="aspect-[4/3] md:aspect-[16/9] w-full relative">
            {imageError ? (
              // Error state - show placeholder with icon
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center space-y-2">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">NFT Preview</p>
                </div>
              </div>
            ) : (
              <Image
                src={currentImageUrl}
                alt="Smart Wallet NFT"
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsImageLoading(false)}
                onError={handleImageError}
                priority
              />
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="font-semibold text-lg text-white">
              {NFT_METADATA.name}
            </h3>
            <p className="text-sm opacity-90 text-white">
              {NFT_METADATA.description}
            </p>
          </div>
        </div>

        {/* Smart Account Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Smart Account</p>
              <p className="text-xs text-blue-600 font-mono break-all">
                {smartAccountAddress}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Active</span>
            </div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">NFT Contract</p>
              <p className="text-xs text-gray-600 font-mono break-all">
                {NFT_CONTRACT_ADDRESS}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                {showDebug ? "Hide Debug" : "Debug"}
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`,
                    "_blank"
                  )
                }
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                View Contract
              </button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {showDebug && <ContractDebug />}

        {/* Data Error Warning */}
        {dataError && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Contract Data Warning
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Some contract functions may not be available. NFT minting
                  should still work.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mint Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  Minting Error
                </p>
                <p className="text-sm text-red-600 break-words overflow-hidden mt-1">
                  {error}
                </p>
                {error.includes("execution reverted") && (
                  <div className="mt-2 text-xs text-red-500">
                    <p>
                      <strong>Possible causes:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Contract doesn't allow public minting</li>
                      <li>Minting is paused or disabled</li>
                      <li>You don't have permission to mint</li>
                      <li>Contract has reached max supply</li>
                      <li>Wrong function name or parameters</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
          <Button
            className="w-full sm:w-auto gap-2 relative overflow-hidden group"
            size="lg"
            onClick={handleMint}
            disabled={isMinting}
          >
            <span
              className={cn(
                "flex items-center gap-2 transition-transform duration-300",
                isMinting ? "translate-y-10" : ""
              )}
            >
              <PlusCircle className="h-[18px] w-[18px]" />
              Mint NFT (Gas Free!)
            </span>
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-transform duration-300",
                isMinting ? "translate-y-0" : "translate-y-10"
              )}
            >
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Minting...
            </span>
          </Button>

          <div className="flex-1"></div>

          {transactionUrl && (
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "gap-2 w-full sm:w-auto relative overflow-hidden transition-all duration-500",
                "border-green-400 text-green-700 hover:bg-green-50",
                "animate-in fade-in duration-700"
              )}
            >
              <Link
                href={transactionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                {showSuccess ? (
                  <>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-10"
                      style={{
                        animation: "sweep 1.5s ease-out",
                      }}
                    />
                    <span className="relative z-10">Mint Successful!</span>
                    <CheckCircle className="h-4 w-4 relative z-10" />
                    <style jsx>{`
                      @keyframes sweep {
                        0% {
                          transform: translateX(-100%);
                          opacity: 0;
                        }
                        50% {
                          opacity: 0.2;
                        }
                        100% {
                          transform: translateX(100%);
                          opacity: 0;
                        }
                      }
                    `}</style>
                  </>
                ) : (
                  <>
                    <span>View Transaction</span>
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </Link>
            </Button>
          )}
        </div>

        {/* Features List */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">
            Smart Account Benefits:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Gas fees sponsored</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Batch transactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Social recovery</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Enhanced security</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
