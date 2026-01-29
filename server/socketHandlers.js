// Socket event handlers for multiplayer game
import { lCards, kiraCards } from "./cards.js";

export function setupSocketHandlers(io, matchmakingQueue, gameRooms) {
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
      tryMatchmaking(io, matchmakingQueue, gameRooms);
    });

    // Card selection event
    socket.on("selectCard", ({ roomId, cardId }) => {
      console.log(`🎴 Card selection attempt:`);
      console.log(`   Socket: ${socket.id}`);
      console.log(`   Room: ${roomId}`);
      console.log(`   Card: ${cardId}`);

      const room = gameRooms.get(roomId);

      if (!room) {
        console.log(`❌ Room ${roomId} not found`);
        socket.emit("error", { message: "Game room not found" });
        return;
      }

      console.log(`✓ Room found: ${roomId}`);
      console.log(`   Turn: ${room.gameState.turn}`);
      console.log(`   Player1 card: ${room.gameState.player1Card || "none"}`);
      console.log(`   Player2 card: ${room.gameState.player2Card || "none"}`);

      // Determine which player
      const isPlayer1 = room.player1.socketId === socket.id;
      const isPlayer2 = room.player2.socketId === socket.id;

      console.log(`   Is Player1? ${isPlayer1} (${room.player1.socketId})`);
      console.log(`   Is Player2? ${isPlayer2} (${room.player2.socketId})`);

      if (!isPlayer1 && !isPlayer2) {
        console.log(`❌ Socket ${socket.id} not in game`);
        socket.emit("error", { message: "You are not in this game" });
        return;
      }

      // Check if player already played
      if (isPlayer1 && room.gameState.player1Card) {
        console.log(`❌ Player1 already played: ${room.gameState.player1Card}`);
        socket.emit("error", {
          message: "You already played a card this turn",
        });
        return;
      }
      if (isPlayer2 && room.gameState.player2Card) {
        console.log(`❌ Player2 already played: ${room.gameState.player2Card}`);
        socket.emit("error", {
          message: "You already played a card this turn",
        });
        return;
      }

      // Store the card selection
      if (isPlayer1) {
        room.gameState.player1Card = cardId;
        console.log(
          `✅ Player1 (${room.player1.username}) selected: ${cardId}`,
        );
      } else {
        room.gameState.player2Card = cardId;
        console.log(
          `✅ Player2 (${room.player2.username}) selected: ${cardId}`,
        );
      }

      // Check if both players have played
      if (room.gameState.player1Card && room.gameState.player2Card) {
        room.gameState.bothCardsPlayed = true;
        console.log(`🎴🎴 BOTH CARDS SELECTED!`);
        console.log(`   Player1: ${room.gameState.player1Card}`);
        console.log(`   Player2: ${room.gameState.player2Card}`);
        console.log(`   Turn completed: ${room.gameState.turn}`);

        // Notify both players that both cards are selected
        io.to(room.player1.socketId).emit("bothCardsSelected", {
          yourCard: room.gameState.player1Card,
          opponentCard: room.gameState.player2Card,
        });
        io.to(room.player2.socketId).emit("bothCardsSelected", {
          yourCard: room.gameState.player2Card,
          opponentCard: room.gameState.player1Card,
        });

        // Reset for next turn
        room.gameState.player1Card = null;
        room.gameState.player2Card = null;
        room.gameState.bothCardsPlayed = false;
        room.gameState.turn++;
        console.log(`   ➡️  Next turn: ${room.gameState.turn}`);
      } else {
        // Notify player their card was accepted
        socket.emit("cardAccepted", { cardId });

        // Notify opponent that player has selected (but don't reveal card)
        const opponent = isPlayer1 ? room.player2 : room.player1;
        console.log(`   Notifying opponent: ${opponent.socketId}`);
        io.to(opponent.socketId).emit("opponentCardSelected");
      }
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
        console.log(
          "Removed from queue. Queue length:",
          matchmakingQueue.length,
        );
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
}

// Helper: Try to match players
function tryMatchmaking(io, matchmakingQueue, gameRooms) {
  while (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();

    const room = createGameRoom(player1, player2, gameRooms);

    // Notify both players
    io.to(player1.socketId).emit("matchFound", {
      roomId: room.roomId,
      playerNumber: 1,
      opponent: {
        username: player2.username,
        character: player2.character,
      },
    });

    io.to(player2.socketId).emit("matchFound", {
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

// Helper: Generate unique room ID
function generateRoomId() {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Create game room for two players
function createGameRoom(player1, player2, gameRooms) {
  const roomId = generateRoomId();

  const room = {
    roomId,
    player1: {
      socketId: player1.socketId,
      character: player1.character,
      username: player1.username || "Player 1",
    },
    player2: {
      socketId: player2.socketId,
      character: player2.character,
      username: player2.username || "Player 2",
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
