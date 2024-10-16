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
  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    if (await checkIfNewChat(roomId)) {
      const savedUserMessage = await saveMessage({
        text: "Hi you can ask me anything about your favourite celebrities!",
        isUser: false,
        username: roomId,
      });
      io.to(roomId).emit("privateMessage", savedUserMessage);
    }

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handling private messages
  socket.on("privateMessage", async (data) => {
    const { message, roomId } = data;

    const savedUserMessage = await saveMessage({
      ...message,
      username: roomId,
    });

    const responseMessageFromBot = await getMessageFromBot(
      savedUserMessage.text
    );

    const saveBotResonseJson = await saveMessage({
      text: responseMessageFromBot,
      isUser: false,
      username: roomId,
    });

    //send back to the room
    io.to(roomId).emit("privateMessage", saveBotResonseJson);
  });

  // Handling disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

async function saveMessage(params) {
  const res = await fetch(`http://localhost:3000/api/messages`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  const responseData = await res.json();
  return responseData;
}

async function checkIfNewChat(params) {
  const res = await fetch(
    `http://localhost:3000/api/messageExists?username=${params}`
  );
  const responseData = await res.json();
  console.log(responseData, "responseData");
  return responseData > 0 ? false : true;
}

async function getMessageFromBot(message) {
  const responseMessage = await fetch(`http://localhost:3000/api/chatbot`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  const responseMessageFromBot = await responseMessage.json();
  return responseMessageFromBot;
}

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
