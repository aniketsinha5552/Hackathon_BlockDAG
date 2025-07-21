'use client'
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { LogOut, Wifi } from 'lucide-react';

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm"></div>
      
      {/* Header content */}
      <div className="relative z-10 w-full flex items-center justify-between px-6 py-4">
        {/* Logo section */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
            <img 
              src="/metadag_icon.png" 
              alt="MetaDAG" 
              className="relative w-10 h-10 rounded-full shadow-lg" 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white drop-shadow-sm">MetaDAG Chatbot</h1>
            <p className="text-xs text-blue-100 hidden sm:block">AI-Powered Smart Contract Development</p>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <div className='mr-10 flex flex-row gap-4'>
              {/* Connection status */}
              <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Wifi className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white font-mono text-sm">
                  {formatAddress(address!)}
                </span>
              </div>
              
              {/* Mobile connection indicator */}
              <div className="lg:hidden flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Wifi className="w-4 h-4 text-green-400" />
              </div>
              
              {/* Disconnect button */}
              <Button
                onClick={() => disconnect()}
                className="bg-red-500/80 hover:bg-red-600/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-red-400/30 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Disconnect</span>
              </Button>
            </div>
          )}
          
          {/* Theme toggle */}
          <ThemeToggle/>
          {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          </div> */}
        </div>
      </div>
      
      {/* Bottom border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default Header;