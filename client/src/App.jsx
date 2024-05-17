import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("response", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, from: "server" },
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket.current && input) {
      socket.current.emit("message", input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, from: "user" },
      ]);
      setInput("");
    }
  };
  return (
    <div className="h-screen bg-white px-3">
      {/* title */}
      <div className="w-full italic py-3 flex justify-center items-center h-fit fixed top-0 bg-white">
        Quote Generator
      </div>
      {/* chat box */}
      <div className="flex flex-col p-3 max-w-screen-md mx-auto pb-36 pt-16">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-md ${
              msg.from === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      {/* Text input */}
      <div className="fixed bottom-0 inset-x-0 px-3 border-t py-3 border-gray-300 bg-white">
        <div className="flex max-w-3xl mx-auto">
          <textarea
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
