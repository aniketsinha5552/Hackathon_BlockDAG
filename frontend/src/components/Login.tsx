import React from "react";
import ConnectButton from "@/components/ConnectButton";
import { useAccount } from "wagmi";

const Login = () => {
  const { isConnected } = useAccount();
  if (isConnected) return null;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070E1B]">
      <h1 className="text-4xl font-bold text-white mb-4">BlockDAG AI Smart Contract Bot</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-xl text-center">
        Chat with AI to generate and deploy smart contracts on the BlockDAG testnet. Connect your wallet to get started!
      </p>
      <ConnectButton />
    </div>
  );
};

export default Login; 