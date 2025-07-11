"use client";

import ConnectButton from "@/components/ConnectButton";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Login from "@/components/Login";
import HomeScreen from "@/components/HomeScreen";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DemoPage() {
  const { address, isConnected } = useAccount();
  // const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  // For Node.js environments
  if (typeof indexedDB === 'undefined') {
    const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
    global.indexedDB = new FDBFactory();
    global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
  }
  return (
    <div className="p-0">
      <ThemeToggle />
      {isConnected ? <HomeScreen /> : <Login />}
    </div>
  );
}