import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupSocketHandlers } from "./socketHandlers.js";

const app = express();
const httpServer = createServer(app);

// Enable CORS for frontend
app.use(cors());

// Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "null"], // Vite dev server + file:// protocol
    methods: ["GET", "POST"],
  },
});

// Game state
const matchmakingQueue = []; // Players waiting for a match
const gameRooms = new Map(); // roomId -> game state

// Setup socket event handlers
setupSocketHandlers(io, matchmakingQueue, gameRooms);

// Basic route
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    connections: io.engine.clientsCount,
    queueLength: matchmakingQueue.length,
    activeGames: gameRooms.size,
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
