import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import { arbitrumSepolia, sepolia, alchemy } from "@account-kit/infra";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is required");
}

if (!PROJECT_ID) {
  console.warn(
    "NEXT_PUBLIC_PROJECT_ID is not set - external wallets will be disabled"
  );
}

export const config = createConfig(
  {
    transport: alchemy({ apiKey: API_KEY }),
    chain: sepolia,
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
    sessionConfig: {
      expirationTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  {
    auth: {
      sections: [
        // [{ type: "email" }],
        // [
        //   { type: "passkey" },
        //   { type: "social", authProviderId: "google", mode: "popup" },
        // ],
        ...(PROJECT_ID
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
    },
  }
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
