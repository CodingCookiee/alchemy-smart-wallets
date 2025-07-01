"use client";

import { useAuthModal } from "@account-kit/react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/common";

export default function LoginCard() {
  const { openAuthModal } = useAuthModal();

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold">
          Smart Wallets Demo
        </CardTitle>
        <CardDescription className="text-lg">
          Experience gasless transactions with Account Abstraction
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Smart Account Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">
            🚀 Smart Account Features:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Gasless NFT minting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Sponsored gas fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Social login (no seed phrases!)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>Account recovery</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <Button
          size="lg"
          onClick={() => openAuthModal()}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800"
        >
          Login for Smart Account
        </Button>

        {/* Info about external wallets */}
        <div className="border-t pt-4">
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Note:</strong> External wallets (MetaMask, etc.) connect as regular EOAs without smart account features.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
