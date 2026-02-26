import { io } from "socket.io-client";

class NetworkManager {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.roomId = null;
    this.isPlayer1 = false;
    this.currentGameState = null;
    this.myCharacter = null; // Store our character choice
    this.opponentCharacter = null;

    // Callbacks for different events
    this.onMatchFound = null;
    this.onTurnComplete = null;
    this.onGameOver = null;
    this.onCardAccepted = null;
    this.onOpponentCardPlayed = null; // NEW: for showing opponent's face-down card
    this.onOpponentDisconnected = null;
    this.onConnectionError = null;
  }
  connect(serverUrl = null) {
    if (this.socket && this.connected) {
      console.log("Already connected to server");
      return;
    }

    // Auto-detect server URL based on environment
    if (!serverUrl) {
      // In production, connect to same domain. In development, use localhost:3001
      serverUrl = window.location.hostname === 'localhost' 
        ? "http://localhost:3001" 
        : window.location.origin;
    }

    console.log("Connecting to server:", serverUrl);
    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on("connect", () => {
      console.log("✅ Connected to server, socket ID:", this.socket.id);
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      this.connected = false;
      this.roomId = null;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      if (this.onConnectionError) {
        this.onConnectionError(error);
      }
    });

    this.socket.on("matchFound", (data) => {
      console.log("🎮 Match found!", data);
      this.roomId = data.roomId;
      this.isPlayer1 = data.playerNumber === 1; // Convert to boolean
      this.opponentCharacter = data.opponent.character;

      // Store the game state with proper structure
      this.currentGameState = {
        player1Character: this.isPlayer1
          ? this.myCharacter
          : data.opponent.character,
        player2Character: this.isPlayer1
          ? data.opponent.character
          : this.myCharacter,
        player1Stats: this.isPlayer1
          ? data.gameState.yourStats
          : data.gameState.opponentStats,
        player2Stats: this.isPlayer1
          ? data.gameState.opponentStats
          : data.gameState.yourStats,
        player1Hand: this.isPlayer1 ? data.gameState.yourHand : [],
        player2Hand: this.isPlayer1 ? [] : data.gameState.yourHand,
        player1Deck: this.isPlayer1
          ? data.gameState.yourDeckSize
          : data.gameState.opponentDeckSize,
        player2Deck: this.isPlayer1
          ? data.gameState.opponentDeckSize
          : data.gameState.yourDeckSize,
        player1Energy: this.isPlayer1
          ? data.gameState.yourEnergy
          : data.gameState.opponentEnergy,
        player2Energy: this.isPlayer1
          ? data.gameState.opponentEnergy
          : data.gameState.yourEnergy,
      };

      if (this.onMatchFound) {
        this.onMatchFound(data);
      }
    });

    this.socket.on("cardAccepted", (data) => {
      console.log("✅ Card accepted by server:", data.card);
      if (this.onCardAccepted) {
        this.onCardAccepted(data);
      }
    });

    this.socket.on("opponentCardPlayed", (data) => {
      console.log("👤 Opponent played a card (face-down)");
      if (this.onOpponentCardPlayed) {
        this.onOpponentCardPlayed(data);
      }
    });

    this.socket.on("turnComplete", (data) => {
      // Transform the game state to match our internal structure
      this.currentGameState = {
        player1Character: this.currentGameState.player1Character, // Keep existing
        player2Character: this.currentGameState.player2Character,
        player1Stats: this.isPlayer1
          ? data.gameState.yourStats
          : data.gameState.opponentStats,
        player2Stats: this.isPlayer1
          ? data.gameState.opponentStats
          : data.gameState.yourStats,
        player1Hand: this.isPlayer1 ? data.gameState.yourHand : [],
        player2Hand: this.isPlayer1 ? [] : data.gameState.yourHand,
        player1Deck: this.isPlayer1
          ? data.gameState.yourDeckSize
          : data.gameState.opponentDeckSize,
        player2Deck: this.isPlayer1
          ? data.gameState.opponentDeckSize
          : data.gameState.yourDeckSize,
        player1Energy: this.isPlayer1
          ? data.gameState.yourEnergy
          : data.gameState.opponentEnergy,
        player2Energy: this.isPlayer1
          ? data.gameState.opponentEnergy
          : data.gameState.yourEnergy,
      };

      if (this.onTurnComplete) {
        this.onTurnComplete(data);
      }
    });

    this.socket.on("gameOver", (data) => {
      console.log("🏁 Game over:", data);
      if (this.onGameOver) {
        this.onGameOver(data);
      }
    });

    this.socket.on("opponentDisconnected", () => {
      console.log("👋 Opponent disconnected");
      if (this.onOpponentDisconnected) {
        this.onOpponentDisconnected();
      }
    });

    this.socket.on("error", (data) => {
      console.error("Server error:", data.message);
    });
  }

  findMatch(character) {
    if (!this.connected) {
      console.error("Not connected to server");
      return;
    }

    console.log("🔍 Finding match with character:", character);
    this.myCharacter = character; // Store our character
    this.socket.emit("findMatch", { character });
  }

  selectCard(cardId) {
    if (!this.connected || !this.roomId) {
      console.error("Not in a game room");
      return;
    }

    console.log("🃏 Selecting card:", cardId);
    this.socket.emit("selectCard", {
      roomId: this.roomId,
      cardId: cardId, // Changed from 'card' to 'cardId'
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting from server");
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.roomId = null;
      this.currentGameState = null;
    }
  }

  // Helper methods to get game state info
  getMyCharacter() {
    if (!this.currentGameState) return null;
    return this.isPlayer1
      ? this.currentGameState.player1Character
      : this.currentGameState.player2Character;
  }

  getOpponentCharacter() {
    if (!this.currentGameState) return null;
    return this.isPlayer1
      ? this.currentGameState.player2Character
      : this.currentGameState.player1Character;
  }

  getMyStats() {
    if (!this.currentGameState) return null;
    return this.isPlayer1
      ? this.currentGameState.player1Stats
      : this.currentGameState.player2Stats;
  }

  getOpponentStats() {
    if (!this.currentGameState) return null;
    return this.isPlayer1
      ? this.currentGameState.player2Stats
      : this.currentGameState.player1Stats;
  }

  getMyHand() {
    if (!this.currentGameState) return [];
    return this.isPlayer1
      ? this.currentGameState.player1Hand
      : this.currentGameState.player2Hand;
  }

  getMyDeckSize() {
    if (!this.currentGameState) return 0;
    return this.isPlayer1
      ? this.currentGameState.player1Deck
      : this.currentGameState.player2Deck;
  }

  getOpponentHandSize() {
    if (!this.currentGameState) return 0;
    return this.isPlayer1
      ? this.currentGameState.player2Hand.length
      : this.currentGameState.player1Hand.length;
  }

  getOpponentDeckSize() {
    if (!this.currentGameState) return 0;
    return this.isPlayer1
      ? this.currentGameState.player2Deck
      : this.currentGameState.player1Deck;
  }

  getMyEnergy() {
    if (!this.currentGameState) return 0;
    return this.isPlayer1
      ? this.currentGameState.player1Energy
      : this.currentGameState.player2Energy;
  }

  getOpponentEnergy() {
    if (!this.currentGameState) return 0;
    return this.isPlayer1
      ? this.currentGameState.player2Energy
      : this.currentGameState.player1Energy;
  }

  hasMyCardBeenPlayed() {
    if (!this.currentGameState) return false;
    return this.isPlayer1
      ? this.currentGameState.player1Card !== null
      : this.currentGameState.player2Card !== null;
  }

  hasOpponentPlayedCard() {
    if (!this.currentGameState) return false;
    return this.isPlayer1
      ? this.currentGameState.player2Card !== null
      : this.currentGameState.player1Card !== null;
  }
}

// Export singleton instance
export default new NetworkManager();
