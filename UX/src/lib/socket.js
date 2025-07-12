import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// ✅ Allow both local dev and Vercel frontend in production
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-application-three-azure.vercel.app"
    ],
    credentials: true,
  },
});

// ✅ Express CORS (for any future use of express routes here)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-application-three-azure.vercel.app"
    ],
    credentials: true,
  })
);

// ✅ Store online users
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // ✅ Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);

    // 🔁 Cleanup
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
