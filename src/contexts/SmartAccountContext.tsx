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
    setIsCreating(true);
    setError(null);

    try {
      const result = await createSmartAccountFromEOA();
      if (result) {
        setSmartAccount(result);
      } else {
        setError("Failed to create smart account");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsCreating(false);
    }
  }, []);

  const clearSmartAccount = useCallback(() => {
    setSmartAccount(null);
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
