"use client";
import { useState, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { UsernameInput } from "./UserNameBox";

import socket from "@/lib/socket";

interface MsgType {
  text: string;
  isUser: boolean;
  timestamp: string;
}
export const ChatWindow = () => {
  const [messages, setMessages] = useState<Array<MsgType>>([]);
  const [input, setInput] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    socket.on("privateMessage", (msg: MsgType) => {
      console.log("privateMessage", msg);
      setMessages((prevMessages: Array<MsgType>) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = (usernameSet: boolean) => {
    setIsUsernameSet(usernameSet);
    socket.emit("joinRoom", username);
    console.log("joinig room");
  };

  const giveConsent = () => {
    const consentMessage = {
      text: "Thank you for giving your consent. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages([consentMessage]);
    setConsentGiven(true);
  };

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setInput("");
      socket.emit("privateMessage", {
        message: newMessage,
        roomId: username,
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4 w-full">
      <div className="flex flex-col overflow-y-auto mb-4 w-full h-full">
        {!isUsernameSet ? (
          <UsernameInput
            username={username}
            setUsername={setUsername}
            setIsUsernameSet={joinRoom}
          />
        ) : !consentGiven ? (
          <div className="p-4 text-center bg-yellow-100 rounded-lg">
            <p>
              To proceed with the chat, please give your consent to share your
              messages.
            </p>
            <button
              onClick={giveConsent}
              className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
            >
              I Consent
            </button>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))
        )}
      </div>

      {isUsernameSet && consentGiven && (
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
      )}
    </div>
  );
};
