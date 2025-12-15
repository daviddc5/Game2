import Phaser from "phaser";
import { getDeckForCharacter, drawCards } from "../data/cards.js";
import { getCharacter, getOpponent } from "../data/characters.js";
import StatBarGroup from "../ui/StatBarGroup.js";
import CardHand from "../ui/CardHand.js";
import BattleLog from "../ui/BattleLog.js";
import GameLogic from "../logic/GameLogic.js";
import AIController from "../logic/AIController.js";
export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  create() {
    // Initialize game state
    this.initializeGameState();

    // Create UI elements in order (top to bottom)
    this.createPortraits();
    this.createStatBars();
    this.createBattleLog();
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

  createPortraits() {
    // Determine which portraits to show based on player character
    const playerPortrait =
      this.playerCharacter.name === "Detective L"
        ? "detective-neutral"
        : "killer-neutral";
    const opponentPortrait =
      this.opponentCharacter.name === "Detective L"
        ? "detective-neutral"
        : "killer-neutral";

    // Side-by-side layout at top
    // Player character on left
    this.playerPortrait = this.add.image(200, 150, playerPortrait);
    this.playerPortrait.setScale(0.3);
    this.playerPortrait.setFlipX(false); // Face right

    // Player name under portrait
    this.add
      .text(200, 250, this.playerCharacter.displayName, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // VS text in middle
    this.add
      .text(375, 150, "VS", {
        fontFamily: "Arial, sans-serif",
        fontSize: "32px",
        color: "#ffaa00",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Opponent character on right
    this.opponentPortrait = this.add.image(550, 150, opponentPortrait);
    this.opponentPortrait.setScale(0.3);
    this.opponentPortrait.setFlipX(true); // Face left

    // Opponent name under portrait
    this.add
      .text(550, 250, this.opponentCharacter.displayName, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  createStatBars() {
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

    // All stats centralized in the middle area
    // Player stats (left side of center)
    const playerStats = playerIsL ? lStats : kiraStats;
    this.playerStatGroup = new StatBarGroup(this, 200, 320, playerStats, true);
    this.playerStatGroup.create();

    // Opponent stats (right side of center)
    const opponentStats = playerIsL ? kiraStats : lStats;
    this.opponentStatGroup = new StatBarGroup(
      this,
      550,
      320,
      opponentStats,
      false
    );
    this.opponentStatGroup.create();

    // Store references for updates (maintain backward compatibility)
    this.statBars = {
      ...this.playerStatGroup.getAllBars(),
      ...this.opponentStatGroup.getAllBars(),
    };
    this.statTexts = {
      ...this.playerStatGroup.getAllTexts(),
      ...this.opponentStatGroup.getAllTexts(),
    };
  }

  createBattleLog() {
    // Create battle log in the center
    this.battleLog = new BattleLog(this, 375, 550, 700, 180);
    this.battleLog.create();

    // Add initial message
    this.battleLog.addMessage("⚔️ Battle Start!", "#ffaa00");
    this.battleLog.addMessage("► YOUR TURN", "#00ff00");
  }

  createCardHand() {
    this.cardHand.setCards(this.hand);
    this.cardHand.render();
  }

  playCard(card, cardIndex) {
    console.log("Playing card:", card.name);

    //block if not player's turn
    if (!this.isPlayerTurn) {
      this.battleLog.addMessage("⚠️ Wait for your turn!", "#ff4444");
      return;
    }
    //block if turn already in progress (prevents rapidClicking)
    if (this.turnInProgress) {
      return;
    }

    //Lock the turn so no other plays can happen until AI turn is over
    this.turnInProgress = true;

    // Log player action
    this.battleLog.addMessage(`You played: ${card.name}`, "#00ff00");

    // Apply card effects to stats and log them
    this.applyCardEffects(card.effects, true);

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

    // Log turn change
    this.battleLog.addMessage("► ENEMY TURN", "#ff4444");

    // Start AI turn after delay
    this.time.delayedCall(1000, () => {
      this.aiTurn();
    });
  }

  applyCardEffects(effects, logEffects = false) {
    // Store old values for logging
    const oldStats = { ...this.stats };

    // Use GameLogic to apply effects with clamping
    this.stats = GameLogic.applyEffects(this.stats, effects);

    // Log stat changes if requested
    if (logEffects) {
      Object.keys(effects).forEach((stat) => {
        const change = this.stats[stat] - oldStats[stat];
        if (change !== 0) {
          const statLabel = this.getStatLabel(stat);
          const color = change > 0 ? "#00ff00" : "#ff4444";
          const prefix = change > 0 ? "+" : "";
          this.battleLog.addMessage(`  ${prefix}${change} ${statLabel}`, color);
        }
      });
    }

    // Update visual bars
    this.updateStatBars();
  }

  getStatLabel(statKey) {
    const labels = {
      evidence: "Evidence",
      morale: "Morale",
      justiceInfluence: "Justice",
      suspicion: "Suspicion",
    };
    return labels[statKey] || statKey;
  }

  updateStatBars() {
    // Use the StatBarGroup's animated update method
    Object.keys(this.stats).forEach((statKey) => {
      const value = this.stats[statKey];

      // Update through stat groups for animation
      if (this.playerStatGroup.bars[statKey]) {
        this.playerStatGroup.updateStat(statKey, value);
      }
      if (this.opponentStatGroup.bars[statKey]) {
        this.opponentStatGroup.updateStat(statKey, value);
      }
    });
  }

  endAITurn() {
    console.log("--- AI turn ended ---");
    this.turnNumber++;
    this.isPlayerTurn = true;
    this.turnInProgress = false;

    // Log turn change
    this.battleLog.addMessage("► YOUR TURN", "#00ff00");

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

    // Log AI action
    this.battleLog.addMessage(`Enemy played: ${bestCard.name}`, "#ff8800");

    // Apply AI card effects
    this.applyCardEffects(bestCard.effects, true);

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
