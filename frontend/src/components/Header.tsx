'use client'
import React from 'react';
import ConnectButton from '@/components/ConnectButton';
import { useAccount, useDisconnect } from 'wagmi';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#070E1B] text-gray-900 dark:text-white">
      <div className="text-xl font-bold">MetaDAG Chatbot</div>
      <div className="flex items-center gap-4">
        {isConnected && (
          <>
            <span className="text-green-400 font-mono text-sm hidden md:inline">{address}</span>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-10"
            >
              Disconnect
            </button>
          </>
        )}
        <ThemeToggle/>
        {/* <ConnectButton /> */}
      </div>
    </div>
  );
};

export default Header;