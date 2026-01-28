import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

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

// Helper: Generate unique room ID
function generateRoomId() {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Create game room for two players
function createGameRoom(player1, player2) {
  const roomId = generateRoomId();
  
  const room = {
    roomId,
    player1: {
      socketId: player1.socketId,
      character: player1.character,
      username: player1.username || 'Player 1',
    },
    player2: {
      socketId: player2.socketId,
      character: player2.character,
      username: player2.username || 'Player 2',
    },
    gameState: {
      turn: 1,
      isPlayer1Turn: true,
      player1Card: null,
      player2Card: null,
      bothCardsPlayed: false,
    },
    createdAt: Date.now(),
  };
  
  gameRooms.set(roomId, room);
  console.log(`🎮 Game room created: ${roomId}`);
  console.log(`   Player 1: ${player1.username} (${player1.character})`);
  console.log(`   Player 2: ${player2.username} (${player2.character})`);
  
  return room;
}

// Helper: Try to match players
function tryMatchmaking() {
  while (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();
    
    const room = createGameRoom(player1, player2);
    
    // Notify both players
    io.to(player1.socketId).emit('matchFound', {
      roomId: room.roomId,
      playerNumber: 1,
      opponent: {
        username: player2.username,
        character: player2.character,
      },
    });
    
    io.to(player2.socketId).emit('matchFound', {
      roomId: room.roomId,
      playerNumber: 2,
      opponent: {
        username: player1.username,
        character: player1.character,
      },
    });
    
    console.log(`✅ Match made! Room: ${room.roomId}`);
  }
}

// Connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Find match event
  socket.on("findMatch", (playerData) => {
    console.log(`🔍 ${playerData.username} looking for match...`);
    
    // Add player to queue
    matchmakingQueue.push({
      socketId: socket.id,
      username: playerData.username || "Anonymous",
      character: playerData.character || "Independent Detective",
      joinedAt: Date.now(),
    });
    
    console.log(`Queue length: ${matchmakingQueue.length}`);
    
    // Try to make a match
    tryMatchmaking();
  });

  // Test event
  socket.on("ping", () => {
    console.log("Ping received from:", socket.id);
    socket.emit("pong", { message: "Server is alive!" });
  });

  // Disconnection handler
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove from matchmaking queue
    const queueIndex = matchmakingQueue.findIndex(
      (p) => p.socketId === socket.id,
    );
    if (queueIndex !== -1) {
      matchmakingQueue.splice(queueIndex, 1);
      console.log("Removed from queue. Queue length:", matchmakingQueue.length);
    }

    // Handle game room disconnection
    for (const [roomId, room] of gameRooms.entries()) {
      if (
        room.player1.socketId === socket.id ||
        room.player2.socketId === socket.id
      ) {
        const opponent =
          room.player1.socketId === socket.id ? room.player2 : room.player1;
        io.to(opponent.socketId).emit("opponentDisconnected");
        gameRooms.delete(roomId);
        console.log("Game room", roomId, "deleted due to disconnect");
      }
    }
  });
});

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
