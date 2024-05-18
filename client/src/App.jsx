import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Typewriter from "typewriter-effect";
import cat from "./assets/cat.png";

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

  const sendMessage = (e) => {
    e.preventDefault();
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
        CatGPT
      </div>
      {/* chat box */}
      <div className="flex flex-col pr-3 max-w-screen-md mx-auto pb-36 pt-16">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-md ${
              msg.from === "user"
                ? "bg-[#F4F4F4] text-black self-end"
                : "bg-transparent text-black self-start"
            }`}
          >
            {msg.from === "user" ? (
              msg.text
            ) : (
              <div className="flex gap-3">
                <img
                  src={cat}
                  alt="cat profile"
                  className="w-10 h-10 rounded-full"
                />
                <Typewriter
                  options={{
                    cursor: "",
                    delay: 20,
                  }}
                  onInit={(typewriter) => {
                    typewriter.typeString(msg.text).start();
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div class="relative flex h-4 w-4 ml-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-black"></span>
          </div>
        )}
      </div>
      {/* Text input */}
      <div className="fixed bottom-0 inset-x-0 px-3 py-3 bg-white">
        <form
          onSubmit={sendMessage}
          className="flex max-w-3xl mx-auto relative"
        >
          <input
            type="text"
            className="flex-1 py-3 px-6 border outline-none rounded-full resize-none bg-[#F4F4F4]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message CatGTP"
            autoFocus
          />
          <button
            className="ml-2 px-4 py-2 bg-black text-white rounded-full absolute right-3 top-1/2 -translate-y-1/2 disabled:bg-black/30"
            disabled={input.length === 0}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
