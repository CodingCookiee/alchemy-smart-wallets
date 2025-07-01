"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  createSmartAccountFromEOA,
  type SmartAccountResult,
} from "@/services/smartAccount";

interface SmartAccountContextType {
  smartAccount: SmartAccountResult | null;
  isCreating: boolean;
  error: string | null;
  createSmartAccount: () => Promise<void>;
  clearSmartAccount: () => void;
  clearError: () => void; // Add this function
}

const SmartAccountContext = createContext<SmartAccountContextType | undefined>(
  undefined
);

export function SmartAccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [smartAccount, setSmartAccount] = useState<SmartAccountResult | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSmartAccount = useCallback(async () => {
    console.log("🚀 SmartAccountContext: Starting smart account creation...");
    setIsCreating(true);
    setError(null);

    try {
      const result = await createSmartAccountFromEOA();
      if (result) {
        console.log(
          "✅ SmartAccountContext: Smart account created successfully"
        );
        setSmartAccount(result);
      } else {
        console.error(
          "❌ SmartAccountContext: Failed to create smart account - no result"
        );
        setError("Failed to create smart account");
      }
    } catch (err) {
      console.error(
        "❌ SmartAccountContext: Error creating smart account:",
        err
      );
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsCreating(false);
    }
  }, []);

  const clearSmartAccount = useCallback(() => {
    console.log("🧹 SmartAccountContext: Clearing smart account");
    setSmartAccount(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    console.log("🧹 SmartAccountContext: Clearing error");
    setError(null);
  }, []);

  return (
    <SmartAccountContext.Provider
      value={{
        smartAccount,
        isCreating,
        error,
        createSmartAccount,
        clearSmartAccount,
        clearError, // Add this to the provider value
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccount() {
  const context = useContext(SmartAccountContext);
  if (context === undefined) {
    throw new Error(
      "useSmartAccount must be used within a SmartAccountProvider"
    );
  }
  return context;
}
