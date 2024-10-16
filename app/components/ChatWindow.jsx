"use client";
import { useState } from "react";
import { ChatBubble } from "./ChatBubble";

export const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you?",
      isUser: false,
      timestamp: new Date(),
    },
    {
      text: "I need help with my order.",
      isUser: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 w-full">
      <div className="flex flex-col overflow-y-auto mb-4 w-full h-full">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg p-2"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};
