import { ChatWindow } from "./components/ChatWindow";

export default function Home() {
  return (
    <div className="h-screen bg-gray-100 w-full">
      <div className="h-full bg-white rounded-lg shadow-lg">
        <ChatWindow />
      </div>
    </div>
  );
}
