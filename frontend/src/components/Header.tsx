'use client'
import React from 'react';
import ConnectButton from '@/components/ConnectButton';
import { useAccount, useDisconnect } from 'wagmi';

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="w-full flex items-center justify-between px-8 py-4 bg-gray-950 border-b border-gray-800">
      <div className="text-xl font-bold text-white">MetaDag Chatbot</div>
      <div className="flex items-center gap-4">
        {isConnected && (
          <>
            <span className="text-green-400 font-mono text-sm hidden md:inline">{address}</span>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Disconnect
            </button>
          </>
        )}
        {/* <ConnectButton /> */}
      </div>
    </div>
  );
};

export default Header;