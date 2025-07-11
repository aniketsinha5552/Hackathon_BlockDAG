"use client";

import React from "react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Feature } from "@/components/feature";
import {Step} from "@/components/step";
import { CheckCircle, MessageSquare, Pencil, Upload } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const gotochatpage = () => {
    router.push('/demo'); 
  };
  return (
    <main className="bg-white dark:bg-[#0c0e12] min-h-screen text-gray-900 dark:text-white p-6 space-y-16">
      <header className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          Build & Deploy Smart Contracts with AI —<br /> Powered by BlockDAG
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl">
          Generate, audit, and deploy contracts using natural language. No code needed.
        </p>
        <div className="flex gap-4">
          <Button variant="default" onClick={gotochatpage}>Try the Demo</Button>
          <Button variant="outline">View on GitHub</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <Feature icon={<MessageSquare />} text="Natural Language Code Generation" />
        <Feature icon={<CheckCircle />} text="Real-time AI Feedback" />
        <Feature icon={<Pencil />} text="Integrated Monaco Editor" />
        <Feature icon={<Upload />} text="Automated Security Audits" />
      </section>

      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">How it Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <Step icon={<MessageSquare />} label="Chat with AI" />
          <Step icon={<Pencil />} label="Edit and audit code live" />
          <Step icon={<Upload />} label="Deploy to BlockDAG testnet" />
        </div>
      </section>

      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">Use Cases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card><CardContent className="p-4">Startups<br /><span className="text-xs">Total UX/99</span></CardContent></Card>
          <Card><CardContent className="p-4">Auditors<br /><span className="text-xs">AI-enhanced audits</span></CardContent></Card>
          <Card><CardContent className="p-4">Web3 Builders<br /><span className="text-xs">Decentralize smart contracts</span></CardContent></Card>
          <Card><CardContent className="p-4">Educators<br /><span className="text-xs">Teach blockchain effortlessly</span></CardContent></Card>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 dark:text-gray-600 mt-10">
        Watch MetaDAG in Action — GistHub · Webshare · Lexplorer
      </footer>
    </main>
  );
}