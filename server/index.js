const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors"); //

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// const userSocketMapping = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  // Joining private room
  socket.on("joinRoom", (roomId) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handling private messages
  socket.on("privateMessage", async (data) => {
    console.log(data);
    const { message, roomId } = data;
    const res = await fetch(`http://localhost:3000/api/messages`, {
      method: "POST",
      body: JSON.stringify({ ...message, username: roomId }),
    });
    const responseData = await res.json();
    console.log(responseData);
    // io.to(roomId).emit("privateMessage", message);
  });

  // Handling disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
