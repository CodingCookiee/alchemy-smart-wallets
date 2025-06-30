"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/common";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@account-kit/react";

export default function LoginCard() {
  const { openAuthModal } = useAuthModal();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    console.log("Login button clicked");
    setIsLoggingIn(true);
    try {
      openAuthModal();
    } catch (error) {
      console.error("Error opening auth modal:", error);
    } finally {
      // Reset loading state after a delay
      setTimeout(() => setIsLoggingIn(false), 2000);
    }
  };

  return (
    <Card
      className={cn(
        "relative w-full max-w-lg mx-auto shadow-2xl border border-gray-200/50",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg",
        "hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]",
        "min-h-[400px]" // Make it bigger
      )}
    >
      <CardHeader className={cn("text-center space-y-6 pb-10 pt-8")}>
        <CardTitle
          className={cn(
            "text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600",
            "dark:from-white dark:to-gray-300 bg-clip-text text-transparent",
            "mb-4"
          )}
        >
          Smart Wallets
        </CardTitle>
        <CardDescription
          className={cn(
            "text-lg text-gray-600 dark:text-gray-400 leading-relaxed px-4",
            "max-w-md mx-auto"
          )}
        >
          Experience seamless onchain UX with smart wallets or connect your existing EOA.
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-8 pb-10 px-8")}>
        <Button
          size="lg"
          onClick={handleLogin}
          disabled={isLoggingIn}
          variant="secondary"
          className={cn(
            "w-full h-14 text-lg font-semibold",
            "bg-gradient-to-r from-blue-600 to-blue-800",
            "hover:from-blue-700 hover:to-blue-900",
            "border-0 shadow-lg hover:shadow-xl",
            "text-white transition-all duration-300",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "rounded-xl"
          )}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className={cn("animate-spin -ml-1 mr-3 h-6 w-6")} />
              Connecting...
            </>
          ) : (
            "Login"
          )}
        </Button>

        {/* Info section */}
        <div className="space-y-4 pt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300">Smart Wallets</p>
                <p className="text-blue-700 dark:text-blue-400">Gas sponsorship, batching, social login</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-orange-800 dark:text-orange-300">External EOAs</p>
                <p className="text-orange-700 dark:text-orange-400">Connect MetaMask, Coinbase Wallet, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
