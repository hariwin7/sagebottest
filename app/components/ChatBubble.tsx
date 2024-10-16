// components/ChatBubble.js
import { cn } from "../../lib/utils";

interface BubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}
export const ChatBubble = ({ message, isUser, timestamp }: BubbleProps) => {
  const date = new Date(timestamp).toLocaleDateString();
  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      className={cn(
        "rounded-lg p-3 m-2 max-w-xs break-words w-full",
        isUser
          ? "bg-blue-500 text-white self-end"
          : "bg-gray-300 text-black self-start"
      )}
    >
      <p>{message}</p>
      <div className="text-xs text-gray-400 mt-1 text-right">
        <p>{date}</p>
        <p>{time}</p>
      </div>
    </div>
  );
};
