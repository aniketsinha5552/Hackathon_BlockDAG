import React from "react";
import { useAccount, useDisconnect } from "wagmi";

const HomeScreen = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="relative min-h-screen bg-[#070E1B] flex flex-col items-center justify-center">
      <button
        onClick={() => disconnect()}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Disconnect
      </button>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to BlockDAG AI Smart Contract Bot</h2>
        <p className="text-gray-300 mb-2">Connected Wallet:</p>
        <span className="text-green-400 font-mono text-lg">{address}</span>
      </div>
    </div>
  );
};

export default HomeScreen; 