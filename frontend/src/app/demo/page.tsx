"use client";

import { useAccount } from "wagmi";
import Login from "@/components/Login";
import HomeScreen from "@/components/HomeScreen";
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DemoPage() {
  const {  isConnected } = useAccount();
  // For Node.js environments
  if (typeof indexedDB === 'undefined') {
    import('fake-indexeddb/lib/FDBFactory').then(({ default: FDBFactory }) => {
      (globalThis as typeof globalThis & { indexedDB?: unknown }).indexedDB = new (FDBFactory as any)();
    });
    import('fake-indexeddb/lib/FDBKeyRange').then(({ default: FDBKeyRange }) => {
      (globalThis as typeof globalThis & { IDBKeyRange?: unknown }).IDBKeyRange = FDBKeyRange as any;
    });
  }
  return (
    <div className="p-0">
      <ThemeToggle />
      {isConnected ? <HomeScreen /> : <Login />}
    </div>
  );
}