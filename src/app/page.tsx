"use client";

import {
  useSignerStatus,
  useUser,
  useSmartAccountClient,
} from "@account-kit/react";
import LoginCard from "@/components/ui/client/login-card";
import NftMintCard from "@/components/ui/client/nft-mint-card";
import Header from "@/components/layout/header";

export default function Home() {
  const signerStatus = useSignerStatus();
  const user = useUser();
  const { client } = useSmartAccountClient({ type: "LightAccount" });

  const isConnected = !!user;
  const isSmartAccount = !!client;

  if (signerStatus.isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="flex justify-center items-center h-full min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="min-h-[calc(100vh-4rem)]">
        <main className="container mx-auto px-4 py-8">
          {!isConnected ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <LoginCard />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Connection Info */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-xl">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-green-600">
                    {isSmartAccount
                      ? "Smart Account Connected"
                      : "Wallet Connected"}
                  </h2>

                  <div className="space-y-2">
                    <p>
                      <strong>Address:</strong> {user?.address}
                    </p>
                    {user?.email && (
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                    )}
                    <p>
                      <strong>Type:</strong> {user?.type.toUpperCase()}
                    </p>
                    {isSmartAccount && (
                      <p>
                        <strong>Smart Account:</strong> ✅ Active
                      </p>
                    )}
                  </div>

                  {isSmartAccount && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-3">
                        Smart Account Features:
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">✅</span>
                          <span>Gas Sponsorship</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">✅</span>
                          <span>Batching</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">✅</span>
                          <span>Social Recovery</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">✅</span>
                          <span>Gasless Transactions</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* NFT Minting - Only show for smart accounts */}
              {isSmartAccount && (
                <div className="grid gap-8 lg:grid-cols-1">
                  <NftMintCard />
                </div>
              )}

              {/* Message for EOA users */}
              {!isSmartAccount && (
                <div className="flex flex-col items-center justify-center  bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    External Wallet Connected
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    You're using an external wallet (EOA). To access smart
                    account features like gas sponsorship and gasless NFT
                    minting, please log in with email or social login.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className=" px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Switch to Smart Account Login
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
