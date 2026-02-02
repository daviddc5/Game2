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
      console.log(`\n🎴 Card selection attempt:`);
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
      const currentPlayer = isPlayer1 ? room.player1 : room.player2;

      console.log(`   Is Player1? ${isPlayer1} (${room.player1.socketId})`);
      console.log(`   Is Player2? ${isPlayer2} (${room.player2.socketId})`);

      if (!isPlayer1 && !isPlayer2) {
        console.log(`❌ Socket ${socket.id} not in game`);
        socket.emit("error", { message: "You are not in this game" });
        return;
      }

      // Special handling for PASS card
      let cardInHand;
      if (cardId === "PASS") {
        console.log(`✓ PASS card - skipping hand validation`);
        cardInHand = {
          id: "PASS",
          name: "Pass",
          selfEffects: {
            investigation: 0,
            morale: 0,
            publicOpinion: 0,
            pressure: 0,
          },
          opponentEffects: {
            investigation: 0,
            morale: 0,
            publicOpinion: 0,
            pressure: 0,
          },
        };
      } else {
        // Validate card is in player's hand
        cardInHand = currentPlayer.hand.find((c) => c.id === cardId);
        if (!cardInHand) {
          console.log(`❌ Card ${cardId} not in player's hand`);
          socket.emit("error", { message: "Card not in your hand" });
          return;
        }
        console.log(`✓ Card validated: ${cardInHand.name}`);
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
        room.gameState.player1CardObject = cardInHand;
        console.log(
          `✅ Player1 (${room.player1.username}) selected: ${cardInHand.name}`,
        );
      } else {
        room.gameState.player2Card = cardId;
        room.gameState.player2CardObject = cardInHand;
        console.log(
          `✅ Player2 (${room.player2.username}) selected: ${cardInHand.name}`,
        );
      }

      // Check if opponent is out of cards - if so, auto-pass for them
      let opponentAutoPassed = false;
      if (isPlayer1 && !room.gameState.player2Card) {
        const p2OutOfCards =
          room.player2.hand.length === 0 && room.player2.deck.length === 0;
        if (p2OutOfCards) {
          console.log(`🚫 Player2 out of cards - auto-passing`);
          room.gameState.player2Card = "PASS";
          room.gameState.player2CardObject = {
            id: "PASS",
            name: "Pass (No Cards)",
            selfEffects: {
              investigation: 0,
              morale: 0,
              publicOpinion: 0,
              pressure: 0,
            },
            opponentEffects: {
              investigation: 0,
              morale: 0,
              publicOpinion: 0,
              pressure: 0,
            },
          };
          opponentAutoPassed = true;
        }
      } else if (isPlayer2 && !room.gameState.player1Card) {
        const p1OutOfCards =
          room.player1.hand.length === 0 && room.player1.deck.length === 0;
        if (p1OutOfCards) {
          console.log(`🚫 Player1 out of cards - auto-passing`);
          room.gameState.player1Card = "PASS";
          room.gameState.player1CardObject = {
            id: "PASS",
            name: "Pass (No Cards)",
            selfEffects: {
              investigation: 0,
              morale: 0,
              publicOpinion: 0,
              pressure: 0,
            },
            opponentEffects: {
              investigation: 0,
              morale: 0,
              publicOpinion: 0,
              pressure: 0,
            },
          };
          opponentAutoPassed = true;
        }
      }

      // Only send cardAccepted if we're actually waiting (no auto-pass)
      if (!opponentAutoPassed) {
        // Notify current player that card was accepted
        socket.emit("cardAccepted", {
          message: "Card accepted, waiting for opponent",
        });

        // Notify opponent that this player played (show face-down card)
        const opponentSocketId = isPlayer1
          ? room.player2.socketId
          : room.player1.socketId;
        io.to(opponentSocketId).emit("opponentCardPlayed", {
          message: "Opponent has played their card",
        });
      }

      // Check if both players have played
      if (room.gameState.player1Card && room.gameState.player2Card) {
        room.gameState.bothCardsPlayed = true;
        console.log(`🎴🎴 BOTH CARDS SELECTED!`);
        console.log(`   Player1: ${room.gameState.player1CardObject.name}`);
        console.log(`   Player2: ${room.gameState.player2CardObject.name}`);
        console.log(`   Turn completed: ${room.gameState.turn}`);

        // Check if this will be the last turn BEFORE removing cards
        const p1WillBeOut =
          (room.player1.hand.length === 1 ||
            room.gameState.player1Card === "PASS") &&
          room.player1.deck.length === 0;
        const p2WillBeOut =
          (room.player2.hand.length === 1 ||
            room.gameState.player2Card === "PASS") &&
          room.player2.deck.length === 0;
        const isLastTurn = p1WillBeOut && p2WillBeOut;

        if (isLastTurn) {
          console.log(
            `⚠️ This is the LAST TURN - both players will be out of cards after this`,
          );
        }

        // Remove cards from hands (don't remove PASS cards)
        if (room.gameState.player1Card !== "PASS") {
          room.player1.hand = room.player1.hand.filter(
            (c) => c.id !== room.gameState.player1Card,
          );
        }
        if (room.gameState.player2Card !== "PASS") {
          room.player2.hand = room.player2.hand.filter(
            (c) => c.id !== room.gameState.player2Card,
          );
        }
        console.log(`   Cards removed from hands`);

        // Calculate and apply stat changes
        const p1Card = room.gameState.player1CardObject;
        const p2Card = room.gameState.player2CardObject;

        console.log(`\n📊 CALCULATING STAT CHANGES:`);

        // Apply Player 1's card effects
        console.log(`   Player1 plays ${p1Card.name}:`);
        console.log(`     Self effects:`, p1Card.selfEffects);
        console.log(`     Opponent effects:`, p1Card.opponentEffects);

        Object.keys(p1Card.selfEffects).forEach((stat) => {
          room.player1.stats[stat] += p1Card.selfEffects[stat];
        });
        Object.keys(p1Card.opponentEffects).forEach((stat) => {
          room.player2.stats[stat] += p1Card.opponentEffects[stat];
        });

        // Apply Player 2's card effects
        console.log(`   Player2 plays ${p2Card.name}:`);
        console.log(`     Self effects:`, p2Card.selfEffects);
        console.log(`     Opponent effects:`, p2Card.opponentEffects);

        Object.keys(p2Card.selfEffects).forEach((stat) => {
          room.player2.stats[stat] += p2Card.selfEffects[stat];
        });
        Object.keys(p2Card.opponentEffects).forEach((stat) => {
          room.player1.stats[stat] += p2Card.opponentEffects[stat];
        });

        // Cap all stats between 0-100
        Object.keys(room.player1.stats).forEach((stat) => {
          room.player1.stats[stat] = Math.max(
            0,
            Math.min(100, room.player1.stats[stat]),
          );
        });
        Object.keys(room.player2.stats).forEach((stat) => {
          room.player2.stats[stat] = Math.max(
            0,
            Math.min(100, room.player2.stats[stat]),
          );
        });

        console.log(`\n📊 NEW STATS (after capping):`);
        console.log(`   Player1:`, room.player1.stats);
        console.log(`   Player2:`, room.player2.stats);

        // Check win conditions
        const winResult = checkWinCondition(room);
        if (winResult) {
          console.log(
            `\n🏆 GAME OVER! ${winResult.winner} wins! Reason: ${winResult.reason}`,
          );

          io.to(room.player1.socketId).emit("gameOver", {
            winner: winResult.winner === "player1" ? "you" : "opponent",
            reason: winResult.reason,
            finalStats: {
              yourStats: room.player1.stats,
              opponentStats: room.player2.stats,
            },
          });

          io.to(room.player2.socketId).emit("gameOver", {
            winner: winResult.winner === "player2" ? "you" : "opponent",
            reason: winResult.reason,
            finalStats: {
              yourStats: room.player2.stats,
              opponentStats: room.player1.stats,
            },
          });

          // Clean up room
          gameRooms.delete(roomId);
          console.log(`   Room ${roomId} deleted`);
          return;
        }

        // Draw cards for next turn (2 each, max hand size 4)
        const MAX_HAND_SIZE = 4;
        const p1DrawCount = Math.min(
          2,
          MAX_HAND_SIZE - room.player1.hand.length,
        );
        const p2DrawCount = Math.min(
          2,
          MAX_HAND_SIZE - room.player2.hand.length,
        );

        const p1DrawnCards = drawCards(room.player1.deck, p1DrawCount);
        const p2DrawnCards = drawCards(room.player2.deck, p2DrawCount);
        room.player1.hand.push(...p1DrawnCards);
        room.player2.hand.push(...p2DrawnCards);

        console.log(`\n🃏 CARD DRAW:`);
        console.log(
          `   Player1 drew ${p1DrawnCards.length} cards, hand: ${room.player1.hand.length}, deck: ${room.player1.deck.length}`,
        );
        console.log(
          `   Player2 drew ${p2DrawnCards.length} cards, hand: ${room.player2.hand.length}, deck: ${room.player2.deck.length}`,
        );
        console.log(
          `   Player1 hand IDs:`,
          room.player1.hand.map((c) => c.id),
        );
        console.log(
          `   Player2 hand IDs:`,
          room.player2.hand.map((c) => c.id),
        );

        // Check card count status AFTER drawing
        let p1OutOfCards =
          room.player1.hand.length === 0 && room.player1.deck.length === 0;
        let p2OutOfCards =
          room.player2.hand.length === 0 && room.player2.deck.length === 0;

        // Only end game if this was the last turn (both players played their final cards)
        if (isLastTurn && p1OutOfCards && p2OutOfCards) {
          console.log(
            `\n⚠️ Both players out of cards! Triggering end-game scoring...`,
          );
          const winResult = checkWinCondition(room);

          if (winResult) {
            io.to(room.player1.socketId).emit("gameOver", {
              winner: winResult.winner === "player1" ? "you" : "opponent",
              reason: winResult.reason,
              finalStats: {
                yourStats: room.player1.stats,
                opponentStats: room.player2.stats,
              },
            });

            io.to(room.player2.socketId).emit("gameOver", {
              winner: winResult.winner === "player2" ? "you" : "opponent",
              reason: winResult.reason,
              finalStats: {
                yourStats: room.player2.stats,
                opponentStats: room.player1.stats,
              },
            });

            gameRooms.delete(roomId);
            console.log(`   Room ${roomId} deleted`);
            return;
          }
        } else if (p1OutOfCards || p2OutOfCards) {
          // One player out of cards - log it but continue
          console.log(`\n⚠️ One player out of cards:`);
          console.log(
            `   Player1: hand=${room.player1.hand.length}, deck=${room.player1.deck.length}`,
          );
          console.log(
            `   Player2: hand=${room.player2.hand.length}, deck=${room.player2.deck.length}`,
          );
        }

        // Increment energy
        room.player1.energy = Math.min(
          room.player1.energy + 5,
          room.player1.maxEnergy,
        );
        room.player2.energy = Math.min(
          room.player2.energy + 5,
          room.player2.maxEnergy,
        );
        console.log(
          `   Energy: P1=${room.player1.energy}, P2=${room.player2.energy}`,
        );

        // Increment turn
        room.gameState.turn++;
        console.log(`   ➡️  Next turn: ${room.gameState.turn}`);

        // Emit full game state to both players
        io.to(room.player1.socketId).emit("turnComplete", {
          yourCard: p1Card,
          opponentCard: p2Card,
          gameState: {
            yourHand: room.player1.hand,
            yourStats: room.player1.stats,
            yourEnergy: room.player1.energy,
            yourDeckSize: room.player1.deck.length,
            opponentStats: room.player2.stats,
            opponentEnergy: room.player2.energy,
            opponentDeckSize: room.player2.deck.length,
            opponentHandSize: room.player2.hand.length,
            turn: room.gameState.turn,
          },
        });

        io.to(room.player2.socketId).emit("turnComplete", {
          yourCard: p2Card,
          opponentCard: p1Card,
          gameState: {
            yourHand: room.player2.hand,
            yourStats: room.player2.stats,
            yourEnergy: room.player2.energy,
            yourDeckSize: room.player2.deck.length,
            opponentStats: room.player1.stats,
            opponentEnergy: room.player1.energy,
            opponentDeckSize: room.player1.deck.length,
            opponentHandSize: room.player1.hand.length,
            turn: room.gameState.turn,
          },
        });

        // Reset for next turn
        room.gameState.player1Card = null;
        room.gameState.player2Card = null;
        room.gameState.player1CardObject = null;
        room.gameState.player2CardObject = null;
        room.gameState.bothCardsPlayed = false;

        // Auto-pass for players who are out of cards (reuse variables from above)
        if (p1OutOfCards && !p2OutOfCards) {
          console.log(
            `🚫 Player1 out of cards for next turn - setting auto-pass`,
          );
          room.gameState.player1Card = "PASS";
          room.gameState.player1CardObject = {
            id: "PASS",
            name: "Pass (No Cards)",
            selfEffects: {},
            opponentEffects: {},
          };
          console.log(
            `   ✅ Auto-pass set: player1Card = ${room.gameState.player1Card}`,
          );
        } else if (p2OutOfCards && !p1OutOfCards) {
          console.log(
            `🚫 Player2 out of cards for next turn - setting auto-pass`,
          );
          room.gameState.player2Card = "PASS";
          room.gameState.player2CardObject = {
            id: "PASS",
            name: "Pass (No Cards)",
            selfEffects: {},
            opponentEffects: {},
          };
          console.log(
            `   ✅ Auto-pass set: player2Card = ${room.gameState.player2Card}`,
          );
        }

        console.log(`\n✅ Turn complete, game state emitted to both players\n`);
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

    // Notify both players with initial game state
    io.to(player1.socketId).emit("matchFound", {
      roomId: room.roomId,
      playerNumber: 1,
      opponent: {
        username: player2.username,
        character: player2.character,
      },
      gameState: {
        yourHand: room.player1.hand,
        yourStats: room.player1.stats,
        yourEnergy: room.player1.energy,
        yourDeckSize: room.player1.deck.length,
        opponentStats: room.player2.stats,
        opponentEnergy: room.player2.energy,
        opponentDeckSize: room.player2.deck.length,
        opponentHandSize: room.player2.hand.length,
        turn: room.gameState.turn,
      },
    });

    io.to(player2.socketId).emit("matchFound", {
      roomId: room.roomId,
      playerNumber: 2,
      opponent: {
        username: player1.username,
        character: player1.character,
      },
      gameState: {
        yourHand: room.player2.hand,
        yourStats: room.player2.stats,
        yourEnergy: room.player2.energy,
        yourDeckSize: room.player2.deck.length,
        opponentStats: room.player1.stats,
        opponentEnergy: room.player1.energy,
        opponentDeckSize: room.player1.deck.length,
        opponentHandSize: room.player1.hand.length,
        turn: room.gameState.turn,
      },
    });

    console.log(`✅ Match made! Room: ${room.roomId}`);
  }
}

// Helper: Get positive/negative stats for a character
function getStatTypes(character) {
  if (character === "Independent Detective") {
    return {
      positive: ["investigation", "morale"],
      negative: ["publicOpinion", "pressure"],
    };
  } else {
    // Vigilante
    return {
      positive: ["morale", "publicOpinion"],
      negative: ["investigation", "pressure"],
    };
  }
}

// Helper: Check win conditions
function checkWinCondition(room) {
  const p1Stats = getStatTypes(room.player1.character);
  const p2Stats = getStatTypes(room.player2.character);

  // Win if ANY of your positive stats reaches 100
  for (const stat of p1Stats.positive) {
    if (room.player1.stats[stat] >= 100) {
      return {
        winner: "player1",
        reason: `${stat.charAt(0).toUpperCase() + stat.slice(1)} reached 100!`,
      };
    }
  }
  for (const stat of p2Stats.positive) {
    if (room.player2.stats[stat] >= 100) {
      return {
        winner: "player2",
        reason: `${stat.charAt(0).toUpperCase() + stat.slice(1)} reached 100!`,
      };
    }
  }

  // Win if opponent's ANY negative stat reaches 100
  for (const stat of p2Stats.negative) {
    if (room.player2.stats[stat] >= 100) {
      return { winner: "player1", reason: `Opponent's ${stat} reached 100!` };
    }
  }
  for (const stat of p1Stats.negative) {
    if (room.player1.stats[stat] >= 100) {
      return { winner: "player2", reason: `Opponent's ${stat} reached 100!` };
    }
  }

  // Win if BOTH players out of cards - calculate overall score
  if (
    room.player1.hand.length === 0 &&
    room.player1.deck.length === 0 &&
    room.player2.hand.length === 0 &&
    room.player2.deck.length === 0
  ) {
    // Score = sum of positive stats - sum of negative stats
    let p1Score = 0;
    for (const stat of p1Stats.positive) {
      p1Score += room.player1.stats[stat];
    }
    for (const stat of p1Stats.negative) {
      p1Score -= room.player1.stats[stat];
    }

    let p2Score = 0;
    for (const stat of p2Stats.positive) {
      p2Score += room.player2.stats[stat];
    }
    for (const stat of p2Stats.negative) {
      p2Score -= room.player2.stats[stat];
    }

    console.log(`📊 OUT OF CARDS - FINAL SCORE:`);
    console.log(`   Player1 (${room.player1.character}): ${p1Score}`);
    console.log(
      `      Positive: ${p1Stats.positive.map((s) => `${s}:${room.player1.stats[s]}`).join(", ")}`,
    );
    console.log(
      `      Negative: ${p1Stats.negative.map((s) => `${s}:${room.player1.stats[s]}`).join(", ")}`,
    );
    console.log(`   Player2 (${room.player2.character}): ${p2Score}`);
    console.log(
      `      Positive: ${p2Stats.positive.map((s) => `${s}:${room.player2.stats[s]}`).join(", ")}`,
    );
    console.log(
      `      Negative: ${p2Stats.negative.map((s) => `${s}:${room.player2.stats[s]}`).join(", ")}`,
    );

    if (p1Score > p2Score) {
      return {
        winner: "player1",
        reason: `Out of cards - Won by score (${p1Score} vs ${p2Score})`,
      };
    } else if (p2Score > p1Score) {
      return {
        winner: "player2",
        reason: `Out of cards - Won by score (${p2Score} vs ${p1Score})`,
      };
    } else {
      // Perfect tie - highest investigation breaks it
      console.log(`   🔀 PERFECT TIE! Using investigation as tiebreaker`);
      const winner =
        room.player1.stats.investigation >= room.player2.stats.investigation
          ? "player1"
          : "player2";
      return { winner, reason: `Out of cards - Tie broken by investigation` };
    }
  }

  return null; // No winner yet
}

// Helper: Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper: Create shuffled deck for a character
function createDeck(character) {
  const deckCards = character === "Independent Detective" ? lCards : kiraCards;
  return shuffleArray(deckCards);
}

// Helper: Draw cards from deck
function drawCards(deck, count) {
  const drawn = [];
  for (let i = 0; i < count && deck.length > 0; i++) {
    drawn.push(deck.pop());
  }
  return drawn;
}

// Helper: Generate unique room ID
function generateRoomId() {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Create game room for two players
function createGameRoom(player1, player2, gameRooms) {
  const roomId = generateRoomId();

  // Create and shuffle decks for both players
  const player1Deck = createDeck(player1.character);
  const player2Deck = createDeck(player2.character);

  // Deal initial hands (4 cards each - hand size limit)
  const player1Hand = drawCards(player1Deck, 4);
  const player2Hand = drawCards(player2Deck, 4);

  console.log(`🃏 Player 1 deck: ${player1Deck.length} cards remaining`);
  console.log(`🃏 Player 2 deck: ${player2Deck.length} cards remaining`);
  console.log(`🖐️  Player 1 hand: ${player1Hand.length} cards`);
  console.log(`🖐️  Player 2 hand: ${player2Hand.length} cards`);

  const room = {
    roomId,
    player1: {
      socketId: player1.socketId,
      character: player1.character,
      username: player1.username || "Player 1",
      deck: player1Deck,
      hand: player1Hand,
      stats: {
        investigation: 0,
        morale: 50,
        publicOpinion: 50,
        pressure: 0,
      },
      energy: 5,
      maxEnergy: 20,
    },
    player2: {
      socketId: player2.socketId,
      character: player2.character,
      username: player2.username || "Player 2",
      deck: player2Deck,
      hand: player2Hand,
      stats: {
        investigation: 0,
        morale: 50,
        publicOpinion: 50,
        pressure: 0,
      },
      energy: 5,
      maxEnergy: 20,
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
