import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Enable CORS for frontend
app.use(cors());

// Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"]
  }
});

// Game state
const matchmakingQueue = []; // Players waiting for a match
const gameRooms = new Map(); // roomId -> game state

// Connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Test event
  socket.on('ping', () => {
    console.log('Ping received from:', socket.id);
    socket.emit('pong', { message: 'Server is alive!' });
  });

  // Disconnection handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from matchmaking queue
    const queueIndex = matchmakingQueue.findIndex(p => p.socketId === socket.id);
    if (queueIndex !== -1) {
      matchmakingQueue.splice(queueIndex, 1);
      console.log('Removed from queue. Queue length:', matchmakingQueue.length);
    }

    // Handle game room disconnection
    for (const [roomId, room] of gameRooms.entries()) {
      if (room.player1.socketId === socket.id || room.player2.socketId === socket.id) {
        const opponent = room.player1.socketId === socket.id ? room.player2 : room.player1;
        io.to(opponent.socketId).emit('opponentDisconnected');
        gameRooms.delete(roomId);
        console.log('Game room', roomId, 'deleted due to disconnect');
      }
    }
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    connections: io.engine.clientsCount,
    queueLength: matchmakingQueue.length,
    activeGames: gameRooms.size
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
