"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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

interface SmartAccountCreatorProps {
  eoaAddress: string;
  onBack: () => void;
  onSuccess?: () => void;
}

export default function SmartAccountCreator({
  eoaAddress,
  onBack,
  onSuccess,
}: SmartAccountCreatorProps) {
  const { smartAccount, isCreating, error, createSmartAccount, clearError } =
    useSmartAccount();
  const [step, setStep] = useState<"confirm" | "creating" | "success">(
    "confirm"
  );
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);

  console.log("🎨 SmartAccountCreator rendered with:", {
    eoaAddress,
    smartAccount: !!smartAccount,
    isCreating,
    error,
    step,
  });

  // Handle smart account creation
  const handleCreateSmartAccount = async () => {
    console.log("🎯 SmartAccountCreator: Create button clicked");
    setStep("creating");

    // Clear any previous errors
    try {
      clearError();
    } catch (err) {
      console.warn("⚠️ clearError function not available:", err);
    }

    try {
      await createSmartAccount();
      // Don't set step to success here - let the effect handle it
    } catch (err) {
      console.error("❌ SmartAccountCreator: Creation failed:", err);
      setStep("confirm"); // Reset to confirm step on error
    }
  };

  // Watch for successful creation
  useEffect(() => {
    if (smartAccount && !isCreating && !error) {
      console.log(
        "✅ SmartAccountCreator: Smart account detected, showing success"
      );
      setStep("success");

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        console.log("🔄 SmartAccountCreator: Auto-closing success modal");
        onSuccess?.(); // Call success callback if provided
        onBack(); // Close the modal
      }, 3000);

      setAutoCloseTimer(timer);
    } else if (error && !isCreating) {
      console.log(
        "❌ SmartAccountCreator: Error detected, resetting to confirm"
      );
      setStep("confirm");
    }
  }, [smartAccount, isCreating, error, onSuccess, onBack]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [autoCloseTimer]);

  // Manual close success modal
  const handleCloseSuccess = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
    onSuccess?.();
    onBack();
  };

  // Handle error dismissal
  const handleDismissError = () => {
    try {
      clearError();
    } catch (err) {
      console.warn("⚠️ clearError function not available:", err);
      // Fallback: just continue without clearing
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

          <div className="space-y-3">
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

            <Button onClick={handleCloseSuccess} className="w-full">
              Continue to Dashboard
            </Button>
          </div>

          {/* Auto-close indicator */}
          <div className="text-center text-xs text-gray-500">
            Automatically redirecting in 3 seconds...
          </div>
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
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">
                  Creation Failed
                </p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={handleDismissError}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
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
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
