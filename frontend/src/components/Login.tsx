import React from "react";
import ConnectButton from "@/components/ConnectButton";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, Shield, Zap, Code, ArrowLeft } from "lucide-react";

const Login = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  
  if (isConnected) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card container */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 text-center relative">
          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 left-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
            title="Back to landing page"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
          </button>
          
          {/* Theme toggle */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          {/* Logo with glow effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <img 
              src="/metadag_icon.png" 
              alt="MetaDAG" 
              className="relative w-24 h-24 mx-auto rounded-full shadow-lg" 
            />
          </div>
          
          {/* Title with gradient */}
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            MetaDAG Chatbot
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Experience the future of smart contract development. Chat with AI to generate, audit, and deploy contracts on the BlockDAG testnet.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Powered</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-500 mb-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-500 mb-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fast Deploy</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Code className="w-6 h-6 text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">No Code</span>
            </div>
          </div>
          
          {/* Connect button */}
          <div className="space-y-4 flex flex-col items-center">
            <ConnectButton />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Connect your wallet to start building on BlockDAG
            </p>
          </div>
        </div>
        
        {/* Bottom text */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Powered by BlockDAG • Built with ❤️ for Web3 developers
        </p>
      </div>
    </div>
  );
};

export default Login; 