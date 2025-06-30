import { config } from "@/utils/config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { AlchemyProviders } from "@/providers/alchemyProviders";
import { SmartAccountProvider } from "@/contexts/SmartAccountContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account Kit Quickstart",
  description: "Account Kit Quickstart NextJS Template",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Persist state across pages
  // https://www.alchemy.com/docs/wallets/react/ssr#persisting-the-account-state
  const headersList = await headers();
  const initialState = cookieToInitialState(
    config,
    headersList.get("cookie") ?? undefined,
    {
      // Set the initial state to be empty if no cookie is found
      initialState: {},
    }
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <AlchemyProviders initialState={initialState}>
          <SmartAccountProvider>{children}</SmartAccountProvider>
        </AlchemyProviders>
      </body>
    </html>
  );
}
