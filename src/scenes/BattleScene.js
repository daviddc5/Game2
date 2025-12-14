import Phaser from "phaser";
import { getDeckForCharacter, drawCards } from "../data/cards.js";
import { getCharacter, getOpponent } from "../data/characters.js";
import StatBarGroup from "../ui/StatBarGroup.js";
import CardHand from "../ui/CardHand.js";
import GameLogic from "../logic/GameLogic.js";
import AIController from "../logic/AIController.js";
export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  create() {
    // Initialize game state
    this.initializeGameState();

    // Create UI elements
    this.createTitle();
    this.createPortraits();
    this.createStatBarGroups();
    this.createCardHand();
  }

  initializeGameState() {
    const playerCharacterName = this.registry.get("playerCharacter");

    //initially set to true as player starts first. Maybe can toss a coin in the future
    this.turnInProgress = false; // Fixed typo: was "turnInprogress"
    // Prevent multiple plays at once
    this.isPlayerTurn = true;
    this.turnNumber = 1;

    // Get character data from config
    this.playerCharacter = getCharacter(playerCharacterName);
    this.opponentCharacter = getOpponent(playerCharacterName);

    // Initialize stat values
    this.stats = {
      evidence: 50,
      morale: 50,
      justiceInfluence: 50,
      suspicion: 50,
    };

    // Get both decks
    this.playerDeck = getDeckForCharacter(this.playerCharacter.name);
    this.opponentDeck = getDeckForCharacter(this.opponentCharacter.name);

    // Draw initial hands
    this.hand = drawCards(this.playerDeck, 3);

    // Initialize AI controller
    this.aiController = new AIController(this.opponentCharacter, this.stats);

    // Initialize card hand UI
    this.cardHand = new CardHand(this);
    this.cardHand.onCardPlayed = (card, index) => this.playCard(card, index);
  }

  createTitle() {
    const centerX = this.cameras.main.width / 2;

    // Turn indicator - positioned above cards
    this.turnText = this.add
      .text(centerX, 650, "YOUR TURN", {
        fontFamily: "Arial, sans-serif",
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1000); // High depth to stay above cards
  }

  createPortraits() {
    // Determine which portraits to show based on player character
    const playerPortrait =
      this.playerCharacter.name === "Detective L"
        ? "l-portrait"
        : "kira-portrait";
    const opponentPortrait =
      this.opponentCharacter.name === "Detective L"
        ? "l-portrait"
        : "kira-portrait";

    // Pokemon-style layout: Player character bottom-left (larger, closer)
    const playerImage = this.add.image(180, 700, playerPortrait);
    playerImage.setScale(0.65); // Larger for player (closer to camera)
    playerImage.setFlipX(true); // Face right toward opponent

    // Enemy character top-right (smaller, further away)
    const opponentImage = this.add.image(500, 400, opponentPortrait);
    opponentImage.setScale(0.45); // Bigger for enemy
    // Don't flip - enemy faces left toward player
  }

  createStatBarGroups() {
    const playerIsL = this.playerCharacter.name === "Detective L";

    // Define stat configurations for each character
    const lStats = [
      { key: "evidence", label: "Evidence", color: 0x00ff00, isPositive: true },
      { key: "morale", label: "Morale", color: 0xff4444, isPositive: false },
    ];

    const kiraStats = [
      {
        key: "justiceInfluence",
        label: "Justice",
        color: 0x00ff00,
        isPositive: true,
      },
      {
        key: "suspicion",
        label: "Suspicion",
        color: 0xff4444,
        isPositive: false,
      },
    ];

    //  Enemy stats at top-right (above enemy)
    const opponentStats = playerIsL ? kiraStats : lStats;
    this.rightStatGroup = new StatBarGroup(
      this,
      400,
      150,
      opponentStats,
      false
    );
    this.rightStatGroup.create();

    // Add opponent name above their stats
    this.add
      .text(560, 130, this.opponentCharacter.displayName, {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Player stats at middle-right (next to player)
    const playerStats = playerIsL ? lStats : kiraStats;
    this.leftStatGroup = new StatBarGroup(this, 400, 700, playerStats, true);
    this.leftStatGroup.create();

    // Add player name above their stats
    this.add
      .text(560, 680, this.playerCharacter.displayName, {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Store references for updates (maintain backward compatibility)
    this.statBars = {
      ...this.leftStatGroup.getAllBars(),
      ...this.rightStatGroup.getAllBars(),
    };
    this.statTexts = {
      ...this.leftStatGroup.getAllTexts(),
      ...this.rightStatGroup.getAllTexts(),
    };
  }

  createCardHand() {
    this.cardHand.setCards(this.hand);
    this.cardHand.render();
  }

  playCard(card, cardIndex) {
    console.log("Playing card:", card.name);

    //block if not player's turn
    if (!this.isPlayerTurn) {
      return;
    }
    //block if turn already in progress (prevents rapidClicking)
    if (this.turnInProgress) {
      return;
    }

    //Lock the turn so no other plays can happen until AI turn is over
    this.turnInProgress = true;

    // Apply card effects to stats
    this.applyCardEffects(card.effects);

    // Remove card from hand
    this.hand.splice(cardIndex, 1);

    // Draw a new card if deck has cards left
    const newCards = drawCards(this.playerDeck, 1);
    if (newCards.length > 0) {
      this.hand.push(newCards[0]);
    }

    // Redraw hand
    this.createCardHand();

    // Check win/loss
    if (this.checkGameOver()) {
      return; // Game ended
    }

    //END PLAYER TURN
    this.endPlayerTurn();
  }

  endPlayerTurn() {
    //switch turn to AI
    this.isPlayerTurn = false;

    // Update UI
    if (this.turnText) {
      this.turnText.setText("ENEMY TURN");
      this.turnText.setColor("#ff4444");
    }

    // Start AI turn after delay
    this.time.delayedCall(1000, () => {
      this.aiTurn();
    });
  }

  applyCardEffects(effects) {
    // Use GameLogic to apply effects with clamping
    this.stats = GameLogic.applyEffects(this.stats, effects);

    // Update visual bars
    this.updateStatBars();
  }

  updateStatBars() {
    // Use the StatBarGroup's animated update method
    Object.keys(this.stats).forEach((statKey) => {
      const value = this.stats[statKey];

      // Update through stat groups for animation
      if (this.leftStatGroup.bars[statKey]) {
        this.leftStatGroup.updateStat(statKey, value);
      }
      if (this.rightStatGroup.bars[statKey]) {
        this.rightStatGroup.updateStat(statKey, value);
      }
    });
  }

  endAITurn() {
    console.log("--- AI turn ended ---");
    this.turnNumber++;
    this.isPlayerTurn = true;
    this.turnInProgress = false;

    // Update UI
    if (this.turnText) {
      this.turnText.setText("YOUR TURN");
      this.turnText.setColor("#00ff00");
    }

    console.log(`=== Turn ${this.turnNumber} - Player's turn ===`);
  }

  aiTurn() {
    console.log("AI turn...");

    // AI draws 3 random cards to choose from
    const aiCards = drawCards(this.opponentDeck, 3);
    if (aiCards.length === 0) return;

    // Choose the best card based on AI logic
    const bestCard = this.chooseBestAICard(aiCards);
    console.log("AI plays:", bestCard.name);

    // Apply AI card effects
    this.applyCardEffects(bestCard.effects);

    // Check win/loss before ending turn
    if (this.checkGameOver()) {
      return; // Game ended, don't continue turn
    }

    // End AI turn
    this.endAITurn();
  }

  chooseBestAICard(cards) {
    // Delegate to AIController
    return this.aiController.chooseBestCard(cards);
  }

  checkGameOver() {
    // Use GameLogic to check win conditions
    const result = GameLogic.checkWinConditions(this.stats);

    if (result.gameOver) {
      console.log(`Game Over! ${result.winner} wins - ${result.reason}`);
      this.gameOver(result.winner);
      return true;
    }

    return false;
  }

  gameOver(winner) {
    // Switch to GameOverScene and pass winner data
    this.scene.start("GameOverScene", {
      winner: winner,
      playerCharacter: this.playerCharacter.name,
    });
  }
}
