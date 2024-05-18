import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { pipeline } from "@xenova/transformers";
import axios from "axios";
import dotenv from "dotenv";

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

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", async (userMessage) => {
    try {
      const generator = await pipeline(
        "text2text-generation",
        "Xenova/LaMini-Flan-T5-783M"
      );
      const response = await generator(userMessage, {
        max_new_tokens: 100,
      });
      const quoteRes = await axios.get("https://api.api-ninjas.com/v1/quotes", {
        headers: { "X-Api-Key": process.env.API_KEY },
      });
      const randomQuote = quoteRes.data[0].quote;
      socket.emit(
        "response",
        `${response[0].generated_text}..Here is a random quote for you. \n${randomQuote}`
      );
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
