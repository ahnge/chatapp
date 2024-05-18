import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { pipeline } from "@xenova/transformers";
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
      const response = await generator(
        `${userMessage}.And generate a random quote.`,
        {
          max_new_tokens: 100,
        }
      );
      console.log(response);
      socket.emit("response", response[0].generated_text);
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
