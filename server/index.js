import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./socketHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const isDevelopment = process.env.NODE_ENV !== "production";

// Enable CORS for frontend
app.use(cors());

// Determine allowed origins based on environment
// In production on Cloud Run, allow same-origin connections
const allowedOrigins = isDevelopment
  ? ["http://localhost:5173", "null"] // Development
  : (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : "*"); // Production: allow all origins (same-origin by default on Cloud Run)

// Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Game state
const matchmakingQueue = []; // Players waiting for a match
const gameRooms = new Map(); // roomId -> game state

// Setup socket event handlers
setupSocketHandlers(io, matchmakingQueue, gameRooms);

// Serve static files in production
// In Docker, dist/ is at /app/dist (sibling of server files)
// Locally, it's at ../dist relative to server/
if (!isDevelopment) {
  const distPath = path.resolve(__dirname, "dist");
  app.use(express.static(distPath));

  // Serve index.html for all routes (SPA support)
  // Use middleware instead of route for Express 5 compatibility
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Basic route for development
  app.get("/", (req, res) => {
    res.json({
      status: "Server is running (development)",
      connections: io.engine.clientsCount,
      queueLength: matchmakingQueue.length,
      activeGames: gameRooms.size,
    });
  });
}

// Use environment variable for port (required by Cloud Run)
const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

httpServer.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on ${HOST}:${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
  console.log(`🌍 Environment: ${isDevelopment ? "development" : "production"}`);
});
