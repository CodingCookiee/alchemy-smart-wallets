import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import { arbitrumSepolia, alchemy } from "@account-kit/infra";


const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;


export const config = createConfig(
  {
    transport: alchemy({ apiKey: API_KEY}), 
    chain: arbitrumSepolia,
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
  },
  {
    auth: {
      sections: [
        [{ type: "email" }],
        [
          { type: "passkey" },
          { type: "social", authProviderId: "google", mode: "popup" },
        ],
      ],
      addPasskeyOnSignup: true,
    },
  },
);

export const queryClient = new QueryClient();