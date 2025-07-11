'use client'
import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { CodeResponse, sendChat } from "@/services/chatService";
import { deploySmartContract, IDeployResponse } from "@/services/deployService";
import toast, { Toaster } from 'react-hot-toast';

interface Message {
    sender: "user" | "ai";
    text: string;
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

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    const handleSend = async () => {
        try {
            console.log("sending message")
            setIsLoading(true)
            if (!input.trim()) return;
            setMessages([...messages, { sender: "user", text: input }]);

            let prompt = input
            setInput("");
            let aiResponse: CodeResponse | undefined = await sendChat(prompt)
            if (!aiResponse) return

            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.text }])
            setCode(aiResponse.code)

        } catch (e: any) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    };

    const handleDeploy = async () => {
        toast.loading('Deployment started...', { id: 'deploy' });
        setIsLoading(true);
        try {
            let deployResponse: IDeployResponse = await deploySmartContract(code)
            console.log(deployResponse)
            setDeployInfo(deployResponse);
            setIsModalOpen(true);
            toast.dismiss('deploy');
        } catch (e: any) {
            toast.dismiss('deploy');
            toast.error('Deployment failed');
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" />
            {/* Modal for deployment info */}
            {isModalOpen && deployInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 text-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Deployment Successful 🎉</h2>
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
                            {('transactionHash' in deployInfo && (deployInfo as any).transactionHash !== undefined && (deployInfo as any).transactionHash !== 'N/A') && (
                                <div><span className="font-semibold">Transaction Hash:</span> {(deployInfo as any).transactionHash}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row w-full h-[80vh] bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {/* Chat Section */}
                <div className="flex flex-col w-full md:w-1/2 h-full p-4 border-r border-gray-800">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"}`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="e.g. ERC-20|burnable, mintable, capped at 1M tokens"
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center min-w-[64px]"
                            onClick={handleSend}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            ) : (
                                'Send'
                            )}
                        </button>
                    </div>
                </div>
                {/* Code Editor Section */}
                <div className="w-full md:w-1/2 h-full flex flex-col">
                    <div className="flex-1">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="solidity"
                            value={code}
                            onChange={(value: any) => setCode(value || "")}
                            theme="vs-dark"
                            options={{ fontSize: 14, minimap: { enabled: false } }}
                        />
                    </div>
                    <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Compile
                        </button>
                        <button onClick={handleDeploy} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center min-w-[64px]" disabled={isLoading}>
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            ) : (
                                'Deploy'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatWithEditor; 