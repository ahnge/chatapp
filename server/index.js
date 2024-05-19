import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Store conversation history for each connected user
const conversations = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Initialize conversation history for this socket
  conversations[socket.id] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. And you always response with a random quote at the end saying 'Here is a quote for you. {quote} where {quote} is the random quote.",
    },
  ];

  socket.on("message", async (userMessage) => {
    try {
      // Add the user's message to the conversation history
      conversations[socket.id].push({ role: "user", content: userMessage });

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversations[socket.id],
        max_tokens: 150,
      });

      const response = completion.choices[0].message.content;

      // Add the assistant's response to the conversation history
      conversations[socket.id].push({ role: "assistant", content: response });

      // Emit the response back to the client
      socket.emit("response", response);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      socket.emit(
        "response",
        "Could not generate a quote at this time. Please try again later."
      );
    }
    // socket.emit("response", "You should test your code!");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
