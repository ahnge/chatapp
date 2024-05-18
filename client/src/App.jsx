import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Typewriter from "typewriter-effect";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("response", (message) => {
      setLoading(false);
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
      setLoading(true);
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
            {msg.from === "user" ? (
              msg.text
            ) : (
              <Typewriter
                options={{
                  cursor: "",
                  delay: 20,
                }}
                onInit={(typewriter) => {
                  typewriter.typeString(msg.text).start();
                }}
              />
            )}
          </div>
        ))}
        {loading && (
          <div class="relative flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-black"></span>
          </div>
        )}
      </div>
      {/* Text input */}
      <div className="fixed bottom-0 inset-x-0 px-3 border-t py-3 border-gray-300 bg-white">
        <div className="flex max-w-3xl mx-auto">
          <textarea
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            autoFocus
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
