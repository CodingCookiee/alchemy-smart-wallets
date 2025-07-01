import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import {arbitrumSepolia , alchemy, defineAlchemyChain } from "@account-kit/infra";
import { sepolia } from "viem/chains";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is required");
}

const alchemySepoliaChain = defineAlchemyChain({
  chain: sepolia,
  rpcBaseUrl: "https://eth-sepolia.g.alchemy.com/v2",
});

export const config = createConfig(
  {
    transport: alchemy({ apiKey: API_KEY }),
    chain: alchemySepoliaChain,
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
    // Enable gas sponsorship
    gasManagerConfig: {
      policyId: process.env.NEXT_PUBLIC_GAS_POLICY_ID || "",
    },
  },
  {
    auth: {
      sections: [
        // Email login creates smart accounts automatically
        [{ type: "email" }],

        // // Social login creates smart accounts automatically
        // [
        //   { type: "passkey" },
        //   { type: "social", authProviderId: "google", mode: "popup" },
        // ],

        // External wallets (EOAs) - these won't get smart account features
        ...(typeof window !== "undefined" && PROJECT_ID
          ? [
              [
                {
                  type: "external_wallets" as const,
                  walletConnect: {
                    projectId: PROJECT_ID,
                    showQrModal: false,
                  },
                },
              ],
            ]
          : []),
      ],
      addPasskeyOnSignup: true,
      showSignInText: true,
    },
  }
);

export const queryClient = new QueryClient();
