"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY); // Ensure API key is in env

export default function ChatGPTLayout() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the chat
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const userMessage = input;
    setInput("");

    try {
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userMessage);

      
      const aiMessage = result.response.text(); // Extract the response text
      setMessages((prev) => [...prev, { role: "ai", text: aiMessage }]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't process that request." },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      {/* Header */}
      <div className="w-full max-w-3xl bg-slate-200 px-4 py-3 rounded-t-md shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center">ChatGPT</h1>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-full max-w-3xl flex-grow bg-white px-4 py-4 overflow-y-auto space-y-4 shadow-md border border-slate-300">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-sm px-4 py-2 rounded-lg shadow-md ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="w-full max-w-3xl bg-slate-200 px-4 py-3 shadow-md rounded-b-md mt-4">
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 rounded-l border border-slate-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
