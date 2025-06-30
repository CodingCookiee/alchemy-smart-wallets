"use client";

import { useSignerStatus, useUser } from "@account-kit/react";
import { useState, useEffect } from "react";
import LoginCard from "@/components/ui/client/login-card";
import SmartAccountCreator from "@/components/ui/client/smart-account-creator";
import Header from "@/components/layout/header";
import { useSmartAccount } from "@/contexts/SmartAccountContext";
import { getEOAAddress } from "@/services/smartAccount";

export default function Home() {
  const signerStatus = useSignerStatus();
  const user = useUser();
  const { smartAccount } = useSmartAccount();
  const [showSmartAccountCreator, setShowSmartAccountCreator] = useState(false);
  const [eoaAddress, setEoaAddress] = useState<string>("");

  // Check for EOA connection
  useEffect(() => {
    const checkEOA = async () => {
      const address = await getEOAAddress();
      if (address) {
        setEoaAddress(address);
      }
    };
    checkEOA();
  }, []);

  // Fix the connection detection logic
  const getConnectionInfo = () => {
    // If we have a smart account, prioritize that
    if (smartAccount) {
      return {
        type: "Smart Account (from EOA)",
        address: smartAccount.address,
        ownerAddress: eoaAddress,
        user,
        isConnected: true,
        isSmartAccount: true,
      };
    }

    // Check if user exists (this indicates connection even if signerStatus is wrong)
    if (!user) return null;

    return {
      type: user.type === "eoa" ? "External Wallet (EOA)" : "Smart Wallet",
      address: user.address,
      user,
      isConnected: true,
      isSmartAccount: false,
    };
  };

  const connectionInfo = getConnectionInfo();
  const isActuallyConnected = !!user || !!smartAccount;

  console.log("Debug - signerStatus:", signerStatus);
  console.log("Debug - user:", user);
  console.log("Debug - smartAccount:", smartAccount);
  console.log("Debug - connectionInfo:", connectionInfo);
  console.log("Debug - isActuallyConnected:", isActuallyConnected);

  // Show smart account creator if user wants to create one
  if (showSmartAccountCreator && eoaAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="bg-bg-main bg-cover bg-center bg-no-repeat h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
          <main className="container mx-auto px-4 py-8">
            <SmartAccountCreator
              eoaAddress={eoaAddress}
              onBack={() => setShowSmartAccountCreator(false)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="bg-bg-main bg-cover bg-center bg-no-repeat h-[calc(100vh-4rem)]">
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
                <h2 className="text-2xl font-bold text-green-600">
                  Connected!
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong>Wallet Type:</strong> {connectionInfo.type}
                  </p>
                  {connectionInfo.user?.email && (
                    <p>
                      <strong>Email:</strong> {connectionInfo.user.email}
                    </p>
                  )}
                  {connectionInfo.address && (
                    <p className="font-mono text-sm break-all">
                      <strong>Address:</strong> {connectionInfo.address}
                    </p>
                  )}
                  {connectionInfo.ownerAddress && (
                    <p className="font-mono text-sm break-all">
                      <strong>Owner EOA:</strong> {connectionInfo.ownerAddress}
                    </p>
                  )}
                </div>

                {/* Show different features based on wallet type */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  {connectionInfo.isSmartAccount ? (
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        Smart Account Features:
                      </h3>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>✅ Gas sponsorship available</li>
                        <li>✅ Transaction batching</li>
                        <li>✅ Social recovery</li>
                        <li>✅ Account abstraction features</li>
                        <li>✅ EOA as owner/signer</li>
                      </ul>
                    </div>
                  ) : connectionInfo.type === "Smart Wallet" ? (
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        Smart Wallet Features:
                      </h3>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>✅ Gas sponsorship available</li>
                        <li>✅ Transaction batching</li>
                        <li>✅ Social recovery</li>
                        <li>✅ Account abstraction features</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        External EOA Connected:
                      </h3>
                      <ul className="text-sm text-orange-700 mt-2 space-y-1">
                        <li>✅ MetaMask wallet connected</li>
                        <li>• You pay your own gas fees</li>
                        <li>• Direct blockchain interaction</li>
                        <li>• Full self-custody control</li>
                      </ul>

                      {/* Option to create smart account from EOA */}
                      <div className="mt-4 pt-3 border-t border-orange-200">
                        <p className="text-xs text-orange-600 mb-2">
                          Want Account Abstraction features?
                        </p>
                        <button
                          onClick={() => setShowSmartAccountCreator(true)}
                          className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                        >
                          Create Smart Account from EOA
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* View on Etherscan buttons */}
                {connectionInfo.address && (
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        window.open(
                          `https://sepolia.etherscan.io/address/${connectionInfo.address}`,
                          "_blank"
                        )
                      }
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View{" "}
                      {connectionInfo.isSmartAccount
                        ? "Smart Account"
                        : "Wallet"}{" "}
                      on Etherscan
                    </button>

                    {connectionInfo.ownerAddress && (
                      <button
                        onClick={() =>
                          window.open(
                            `https://sepolia.etherscan.io/address/${connectionInfo.ownerAddress}`,
                            "_blank"
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        View Owner EOA on Etherscan
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center  pb-[4rem]">
              <LoginCard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
