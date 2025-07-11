import React from "react";
import ConnectButton from "@/components/ConnectButton";
import { useAccount } from "wagmi";

const Login = () => {
  const { isConnected } = useAccount();
  if (isConnected) return null;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#070E1B] text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">MetaDAG Chatbot</h1>
      <p className="text-lg mb-8 max-w-xl text-center">
        Chat with AI to generate and deploy smart contracts on the BlockDAG testnet. Connect your wallet to get started!
      </p>
      <ConnectButton />
    </div>
  );
};

export default Login; 