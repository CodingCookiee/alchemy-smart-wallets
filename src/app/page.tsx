"use client";

import { useSignerStatus, useUser } from "@account-kit/react";
import LoginCard from "@/components/ui/client/login-card";
import Header from "@/components/layout/header";

export default function Home() {
  const signerStatus = useSignerStatus();
  const user = useUser();

  // Fix the connection detection logic
  const getConnectionInfo = () => {
    // Check if user exists (this indicates connection even if signerStatus is wrong)
    if (!user) return null;

    return {
      type: user.type === 'eoa' ? 'External Wallet (EOA)' : 'Smart Wallet',
      address: user.address,
      user,
      isConnected: true
    };
  };

  const connectionInfo = getConnectionInfo();
  const isActuallyConnected = !!user; // Use user presence as connection indicator

  console.log("Debug - signerStatus:", signerStatus);
  console.log("Debug - user:", user);
  console.log("Debug - connectionInfo:", connectionInfo);
  console.log("Debug - isActuallyConnected:", isActuallyConnected);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="!px-10 py-2 bg-white/70 backdrop-blur-md shadow-md">

        <Header />
      </div>
      <div className="bg-bg-main bg-cover bg-center bg-no-repeat h-full flex flex-col justify-center items-center">
        <main className="container mx-auto px-4 py-8 h-full">
          {signerStatus.isInitializing ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Initializing...</p>
              </div>
            </div>
          ) : isActuallyConnected && connectionInfo ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center space-y-4 bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-xl max-w-md">
                <h2 className="text-2xl font-bold text-green-600">Connected!</h2>
                <div className="space-y-2">
                  <p><strong>Wallet Type:</strong> {connectionInfo.type}</p>
                  {connectionInfo.user?.email && (
                    <p><strong>Email:</strong> {connectionInfo.user.email}</p>
                  )}
                  {connectionInfo.address && (
                    <p className="font-mono text-sm break-all">
                      <strong>Address:</strong> {connectionInfo.address}
                    </p>
                  )}
                </div>
                
               

                {/* View on Etherscan button for EOAs */}
                {connectionInfo.type === 'External Wallet (EOA)' && connectionInfo.address && (
                  <button
                    onClick={() => window.open(`https://sepolia.etherscan.io/address/${connectionInfo.address}`, '_blank')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View on Etherscan
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full pb-[4rem] w-full">
              <LoginCard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
