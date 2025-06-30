"use client";

import { useSignerStatus } from "@account-kit/react";
// import UserInfoCard from "./components/user-info-card";
// import NftMintCard from "./components/nft-mint-card";
import LoginCard from "@/components/ui/client/login-card";
import Header from "@/components/layout/header";
// import LearnMore from "./components/learn-more";

export default function Home() {
  const signerStatus = useSignerStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="bg-bg-main bg-cover bg-center bg-no-repeat h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <main className="container mx-auto px-4 py-8  ">
          {/* {signerStatus.isConnected ? (
            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
              <div className="flex flex-col gap-8">
                <UserInfoCard />
                <LearnMore />
              </div>
              <NftMintCard />
            </div>
          ) : ( */}
          <div className="flex justify-center items-center h-full pb-[4rem]">
            <LoginCard />
          </div>
          {/* )} */}
        </main>
      </div>
    </div>
  );
}
