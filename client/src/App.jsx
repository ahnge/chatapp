import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

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
    <div className="App">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
