'use client'
import React, { useState, useEffect, useRef } from "react";
// import MonacoEditor from "@monaco-editor/react";
import { CodeResponse, saveChat, sendChat } from "@/services/chatService";
import { deploySmartContract, IDeployResponse, saveDeployment, getDeployments } from "@/services/deployService";
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from "wagmi";
import { getChat } from "@/services/chatService";
import DeploymentHistoryTable from "./DeploymentHistoryTable";
import { Button } from "./ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "./ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Message {
    sender: "user" | "ai";
    text: string;
    code?: string
}

interface Deployment {
    contractName?: string;
    contractAddress?: string;
    network?: string;
    timestamp?: string;
    explorerUrl?: string;
    // [key: string]: any;
}

const initialCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public greeting = "Hello, BlockDAG!";

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
`;

const ChatWithEditor = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [code, setCode] = useState(initialCode);
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deployInfo, setDeployInfo] = useState<IDeployResponse | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const { address } = useAccount();
    const { theme } = useTheme();

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const fetchChat = async () => {
            if (!address) return;
            try {
                const res = await getChat(address);
                if (res && res.data && res.data.chat_history) {
                    // Convert chat_history to Message[]
                    const loadedMessages: Message[] = res.data.chat_history.map((msg: unknown) => {
                        if (typeof msg === 'object' && msg !== null && 'sender' in msg) {
                            return {
                                sender: (msg as { sender: string }).sender,
                                text: (msg as { message?: string; text?: string }).message || (msg as { text?: string }).text || "",
                                code: (msg as { code?: string }).code
                            };
                        }
                        return { sender: 'ai', text: '', code: '' };
                    });
                    setMessages(loadedMessages);
                    // Find last AI message with code
                    const lastAiMsg = [...loadedMessages].reverse().find((m: Message) => m.sender === 'ai' && !!m.code);
                    if (lastAiMsg && lastAiMsg.code) {
                        setCode(lastAiMsg.code);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchChat();
    }, [address]);


    const handleSend = async () => {
        if (!address) {
            toast.error("Wallet not connected");
            return;
        }
        try {
            const chatPayload: Message[] = [];
            setIsLoading(true);
            if (!input.trim()) return;
            const userMessage: Message = { sender: "user", text: input };
            setMessages([...messages, userMessage]);
            chatPayload.push(userMessage);

            const prompt = input;
            setInput("");
            const aiResponse: CodeResponse | undefined = await sendChat(prompt);
            if (!aiResponse) return;

            const aiMessage: Message = { sender: 'ai', text: aiResponse.text, code: aiResponse.code };
            setMessages(prev => [...prev, aiMessage]);
            setCode(aiResponse.code);
            chatPayload.push(aiMessage);

            await saveChat(address, chatPayload);

        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeploy = async () => {
        if (!address) {
            toast.error("Wallet not connected");
            return;
        }
        toast.loading('Deployment started...', { id: 'deploy' });
        setIsLoading(true);
        try {
            const deployResponse: IDeployResponse = await deploySmartContract(code);
            await saveDeployment(deployResponse, address);
            setDeployInfo(deployResponse);
            setIsModalOpen(true);
            toast.dismiss('deploy');
        } catch (e) {
            toast.dismiss('deploy');
            toast.error('Deployment failed');
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenHistory = async () => {
        if (!address) {
            toast.error("Wallet not connected");
            return;
        }
        try {
            const deployments: IDeployResponse[] = await getDeployments(address);
            setDeployments(deployments);
            setIsHistoryModalOpen(true);
        } catch {
            toast.error("Failed to fetch deployment history");
            setDeployments([]);
            setIsHistoryModalOpen(true);
        }
    };

    return (
        <>
            <Toaster position="top-center" />
            {/* Modal for deployment info */}
            {isModalOpen && deployInfo && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-lg w-full">
                        <DialogHeader>
                            <DialogTitle>Deployment Successful 🎉</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            {deployInfo.contractAddress && (
                                <div><span className="font-semibold">Contract Address:</span> <span className="break-all">{deployInfo.contractAddress}</span></div>
                            )}
                            {deployInfo.network && (
                                <div><span className="font-semibold">Network:</span> {deployInfo.network}</div>
                            )}
                            {deployInfo.contractName && (
                                <div><span className="font-semibold">Contract Name:</span> {deployInfo.contractName}</div>
                            )}
                            {deployInfo.explorerUrl && (
                                <div className="break-all word-break break-words">
                                    <span className="font-semibold">Explorer URL:</span> <a href={deployInfo.explorerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{deployInfo.explorerUrl}</a>
                                </div>
                            )}
                            {(
                                typeof deployInfo === 'object' &&
                                deployInfo !== null &&
                                'transactionHash' in deployInfo &&
                                (deployInfo as { transactionHash?: unknown }).transactionHash !== undefined &&
                                (deployInfo as { transactionHash?: unknown }).transactionHash !== 'N/A'
                            ) && (
                                <div><span className="font-semibold">Transaction Hash:</span> {String((deployInfo as { transactionHash?: unknown }).transactionHash)}</div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {/* Modal for deployment history */}
            <DeploymentHistoryTable
                deployments={deployments}
                open={isHistoryModalOpen}
                onOpenChange={setIsHistoryModalOpen}
            />
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row w-full h-[85vh] rounded-2xl shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/20">
                {/* Chat Section */}
                <div className="flex flex-col w-full md:w-1/2 h-full">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            AI Assistant
                        </h2>
                        <p className="text-blue-100 text-xs mt-1">Describe your smart contract and I'll generate it for you</p>
                    </div>
                    
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium mb-2">Start a conversation</p>
                                <p className="text-sm">Ask me to create any type of smart contract</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                        msg.sender === "user" 
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                                            : "bg-gradient-to-r from-purple-500 to-purple-600"
                                    }`}>
                                        {msg.sender === "user" ? "U" : "AI"}
                                    </div>
                                    
                                    {/* Message Bubble */}
                                    <div
                                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                                            msg.sender === "user"
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-md"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    
                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-3">
                            <Input
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="e.g. Create an ERC-20 token with minting and burning capabilities"
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                            <Button
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSend}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Code Editor Section */}
                <div className="w-full md:w-1/2 h-full flex flex-col border-l border-gray-200 dark:border-gray-700">
                    {/* Editor Header */}
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-3 text-white">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            Smart Contract Editor
                        </h2>
                        <p className="text-gray-300 text-xs mt-1">Edit and deploy your Solidity contract</p>
                    </div>
                    
                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="solidity"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme={theme === 'dark' ? 'vs-dark' : 'light'}
                            options={{ 
                                fontSize: 14, 
                                minimap: { enabled: false },
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true
                            }}
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-3">
                            <Button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                Compile
                            </Button>
                            <Button 
                                onClick={handleDeploy} 
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                )}
                                Deploy
                            </Button>
                            <Button
                                onClick={handleOpenHistory}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                title="View Deployment History"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                History
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatWithEditor; 