const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const api_url = "https://api.api-ninjas.com/v1/quotes";
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", async () => {
    try {
      const response = await axios.get(api_url, {
        headers: { "X-Api-Key": process.env.API_KEY },
      });
      const quote = response.data[0];
      socket.emit("response", `${quote.quote} - ${quote.author}`);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      socket.emit(
        "response",
        "Could not fetch a quote at this time. Please try again later."
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
