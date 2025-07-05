'use client'
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

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

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");
        // Here you would call your AI backend and append the AI response
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-[80vh] bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Chat Section */}
            <div className="flex flex-col w-full md:w-1/2 h-full p-4 border-r border-gray-800">
                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-700 text-gray-100 self-start"}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="e.g. Write an ERC20 token contract with mint and burn functions"
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleSend}
                    >
                        Send
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
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Deploy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWithEditor; 