interface UsernameProps {
  username: string;
  setUsername: (value: string) => void;
  setIsUsernameSet: (value: boolean) => void;
}
export const UsernameInput = ({
  username,
  setUsername,
  setIsUsernameSet,
}: UsernameProps) => {
  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setIsUsernameSet(true); // Proceed to the chat when a valid username is entered
    }
  };

  return (
    <div className="p-4 text-center bg-yellow-100 rounded-lg">
      <p>Please enter your username to start the chat.</p>
      <div className="flex gap-5 justify-center">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg p-2 mt-2"
          placeholder="Enter username"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUsernameSubmit();
          }}
        />
        <button
          onClick={handleUsernameSubmit}
          className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};
