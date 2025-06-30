"use client";

import { useState } from "react";
import { Loader2, Wallet, ArrowRight, CheckCircle } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/common";
import { cn } from "@/lib/utils";
import { useSmartAccount } from "@/contexts/SmartAccountContext";
import { getEOAAddress } from "@/services/smartAccount";

interface SmartAccountCreatorProps {
  eoaAddress: string;
  onBack: () => void;
}

export default function SmartAccountCreator({
  eoaAddress,
  onBack,
}: SmartAccountCreatorProps) {
  const { smartAccount, isCreating, error, createSmartAccount } =
    useSmartAccount();
  const [step, setStep] = useState<"confirm" | "creating" | "success">(
    "confirm"
  );

  const handleCreateSmartAccount = async () => {
    setStep("creating");
    await createSmartAccount();
    if (!error) {
      setStep("success");
    }
  };

  if (step === "success" && smartAccount) {
    return (
      <Card
        className={cn(
          "relative w-full max-w-lg mx-auto shadow-2xl border border-green-200/50",
          "bg-white/80 backdrop-blur-lg min-h-[400px]"
        )}
      >
        <CardHeader className={cn("text-center space-y-6 pb-10 pt-8")}>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className={cn("text-3xl font-bold text-green-600")}>
            Smart Account Created!
          </CardTitle>
          <CardDescription
            className={cn("text-lg text-gray-600 leading-relaxed px-4")}
          >
            Your EOA is now the owner of a new smart account with Account
            Abstraction features.
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("space-y-6 pb-10 px-8")}>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">EOA Owner</h3>
              <p className="font-mono text-sm text-blue-700 break-all">
                {eoaAddress}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                Smart Account Address
              </h3>
              <p className="font-mono text-sm text-green-700 break-all">
                {smartAccount.address}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Available Features:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Gas sponsorship (when configured)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Transaction batching</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Social recovery options</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Account abstraction benefits</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() =>
              window.open(
                `https://sepolia.etherscan.io/address/${smartAccount.address}`,
                "_blank"
              )
            }
            variant="outline"
            className="w-full"
          >
            View Smart Account on Etherscan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative w-full max-w-lg mx-auto shadow-2xl border border-gray-200/50",
        "bg-white/80 backdrop-blur-lg min-h-[400px]"
      )}
    >
      <CardHeader className={cn("text-center space-y-6 pb-10 pt-8")}>
        <CardTitle className={cn("text-3xl font-bold text-gray-900")}>
          Create Smart Account
        </CardTitle>
        <CardDescription
          className={cn("text-lg text-gray-600 leading-relaxed px-4")}
        >
          Transform your EOA into a smart account owner to unlock Account
          Abstraction features.
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-6 pb-10 px-8")}>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Your EOA</h3>
            <p className="font-mono text-sm text-gray-600 break-all">
              {eoaAddress}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Will Become</h3>
            <p className="text-blue-700 text-sm">
              Smart Account Owner & Signer
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleCreateSmartAccount}
            disabled={isCreating || step === "creating"}
            className={cn(
              "w-full h-12 text-lg font-semibold",
              "bg-gradient-to-r from-blue-600 to-blue-800",
              "hover:from-blue-700 hover:to-blue-900",
              "text-white transition-all duration-300"
            )}
          >
            {isCreating || step === "creating" ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Creating Smart Account...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Create Smart Account
              </>
            )}
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
            disabled={isCreating}
          >
            Back to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
