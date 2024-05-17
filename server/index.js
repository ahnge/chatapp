const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const quotes = fs.readFileSync("quotes.txt", "utf-8").split("\n");

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    socket.emit("response", randomQuote);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
