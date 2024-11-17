// Install Socket.IO client in your client environment with:
// npm install socket.io-client

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");  // Adjust the URL to match your server

// Connect to the server
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // Join a room or send a message to test
  socket.emit("joinRoom", "userId_example");
  socket.emit("sendMessage", { sender: "67364b60249bc14f81beae03", receiver: "67364b60249bc14f81beae03", message: "Hello!" });
});

// Listen for a message from the server
socket.on("receiveMessage", (message) => {
  console.log("New message received:", message);
});
