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
        " relative  w-full max-w-md shadow-xl border border-gray-200/50",
        "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md",
        "hover:shadow-2xl transition-all duration-300"
      )}
    >
      <CardHeader className={cn("text-center space-y-4 pb-8")}>
        <CardTitle
          className={cn(
            "text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600",
            "dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          )}
        >
          Smart Wallets
        </CardTitle>
        <CardDescription
          className={cn("text-base text-gray-600 dark:text-gray-400")}
        >
          Experience seamless onchain UX with smart wallets. Click log in to
          continue.
        </CardDescription>
      </CardHeader>

      <CardContent
        className={cn("space-y-12 pb-8  flex flex-col items-center")}
      >
        <Button
          size="lg"
          variant="outline"
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className={cn("animate-spin -ml-1 mr-3 h-5 w-5")} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
