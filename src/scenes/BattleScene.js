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
    this.createStagingArea();
    this.selectedCard = null; // track which card is selected
    this.isSelectingCard = false; // track if player is in card selection mode
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
    this.cardHand.onCardPlayed = (card, index) => this.selectCard(card, index);
  }

  createPortraits() {
    // Determine which portraits to show based on player character
    const playerPortrait =
      this.playerCharacter.name === "Independent Detective"
        ? "detective-neutral"
        : "killer-neutral";
    const opponentPortrait =
      this.opponentCharacter.name === "Independent Detective"
        ? "detective-neutral"
        : "killer-neutral";

    // ENEMY at top (compact)
    this.opponentPortrait = this.add.image(80, 75, opponentPortrait);
    this.opponentPortrait.setScale(0.15); // Smaller
    this.opponentPortrait.setFlipX(false);

    this.add
      .text(160, 75, this.opponentCharacter.displayName, {
        fontSize: "16px",
        color: "#ff4444",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // VS text in center
    this.add
      .text(375, 450, "VS", {
        fontSize: "48px",
        color: "#ffaa00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(50);

    // PLAYER at bottom right (compact)
    this.playerPortrait = this.add.image(600, 780, playerPortrait);
    this.playerPortrait.setScale(0.15); // Smaller
    this.playerPortrait.setFlipX(true);

    this.add
      .text(520, 780, this.playerCharacter.displayName, {
        fontSize: "16px",
        color: "#00aaff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0.5);
  }

  createStatBars() {
    const playerIsDetective =
      this.playerCharacter.name === "Independent Detective";

    // Define stat configurations for each character
    const detectiveStats = [
      { key: "evidence", label: "Evidence", color: 0x00ff00, isPositive: true },
      { key: "morale", label: "Morale", color: 0xff4444, isPositive: false },
    ];

    const vigilanteStats = [
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

    // Opponent stats (below portrait at top)
    const opponentStats = playerIsDetective ? vigilanteStats : detectiveStats;
    this.opponentStatGroup = new StatBarGroup(
      this,
      20,
      180,
      opponentStats,
      false
    );
    this.opponentStatGroup.create();

    // Player stats (above portrait at bottom right)
    const playerStats = playerIsDetective ? detectiveStats : vigilanteStats;
    this.playerStatGroup = new StatBarGroup(this, 400, 650, playerStats, true);
    this.playerStatGroup.create();

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
    // Battle log hidden for now (can toggle later)
    this.battleLog = new BattleLog(this, 375, 1400, 700, 180);
    this.battleLog.create();

    // Hide all battle log elements
    this.battleLog.background.setVisible(false);
    this.battleLog.titleText.setVisible(false);
    this.battleLog.textObjects.forEach((obj) => obj.setVisible(false));

    // Add initial message
    this.battleLog.addMessage("⚔️ Battle Start!", "#ffaa00");
    this.battleLog.addMessage("► YOUR TURN", "#00ff00");
  }

  createCardHand() {
    this.cardHand.setCards(this.hand);
    this.cardHand.render();
  }

  // legacy version of playcard
  // playCard(card, cardIndex) {
  //   console.log("Playing card:", card.name);

  //   //block if not player's turn
  //   if (!this.isPlayerTurn) {
  //     this.battleLog.addMessage("⚠️ Wait for your turn!", "#ff4444");
  //     return;
  //   }
  //   //block if turn already in progress (prevents rapidClicking)
  //   if (this.turnInProgress) {
  //     return;
  //   }
  //   // Set selected card

  //   //Lock the turn so no other plays can happen until AI turn is over
  //   this.turnInProgress = true;

  //   // Log player action
  //   this.battleLog.addMessage(`You played: ${card.name}`, "#00ff00");

  //   // Apply card effects to stats and log them
  //   this.applyCardEffects(card.effects, true);

  //   // Remove card from hand
  //   this.hand.splice(cardIndex, 1);

  //   // Draw a new card if deck has cards left
  //   const newCards = drawCards(this.playerDeck, 1);
  //   if (newCards.length > 0) {
  //     this.hand.push(newCards[0]);
  //   }

  //   // Redraw hand
  //   this.createCardHand();

  //   // Check win/loss
  //   if (this.checkGameOver()) {
  //     return; // Game ended
  //   }

  //   //END PLAYER TURN
  //   this.endPlayerTurn();
  // }

  // sets selected cards and shows confirm button
  selectCard(card, cardIndex) {
    console.log("Selecting card:", card.name);

    // Block if not player's turn
    if (!this.isPlayerTurn) {
      this.battleLog.addMessage("⚠️ Wait for your turn!", "#ff4444");
      return;
    }

    // Block if turn already in progress
    if (this.turnInProgress) {
      return;
    }

    //select card without playing it
    this.selectedCard = { card, cardIndex };
    this.isSelectingCard = true;

    //Highlighting the selected card
    this.cardHand.highlightCard(cardIndex);

    //Show the confirm button
    if (!this.confirmButton) {
      this.createConfirmButton();
    }
    this.confirmButton.setVisible(true);
  }

  createConfirmButton() {
    // Create confirm button below the hand
    this.confirmButton = this.add
      .text(375, 850, "CONFIRM PLAY", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#00aa00",
        padding: { x: 30, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(1000)
      .setVisible(false); // Hidden until card selected

    this.confirmButton.on("pointerdown", () => this.confirmCardPlay());

    // Hover effect
    this.confirmButton.on("pointerover", () => {
      this.confirmButton.setBackgroundColor("#00ff00");
    });
    this.confirmButton.on("pointerout", () => {
      this.confirmButton.setBackgroundColor("#00aa00");
    });
  }

  createStagingArea() {
    // Enemy staging at top center
    this.add
      .text(375, 260, "ENEMY CARD", {
        fontSize: "18px",
        color: "#ff4444",
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Player staging at bottom center
    this.add
      .text(375, 550, "YOUR CARD", {
        fontSize: "18px",
        color: "#00aaff",
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Placeholders for face-down cards (will show later)
    this.playerStagedCard = null;
    this.opponentStagedCard = null;
  }

  confirmCardPlay() {
    if (!this.selectedCard) return;

    // Hide confirm button
    this.confirmButton.setVisible(false);

    // Lock the turn
    this.turnInProgress = true;

    // Show player's card face-down in staging area (centered)
    this.playerStagedCard = this.add
      .rectangle(375, 600, 120, 160, 0x333333)
      .setStrokeStyle(3, 0x00aaff)
      .setDepth(100);

    this.playerStagedCardBack = this.add
      .text(375, 600, "🂠", {
        fontSize: "100px",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Remove card from hand visually
    this.hand.splice(this.selectedCard.cardIndex, 1);
    this.cardHand.setCards(this.hand);
    this.cardHand.render();

    // Now trigger AI turn
    this.time.delayedCall(500, () => this.aiSelectCard());
  }

  aiSelectCard() {
    // AI picks a random card
    const aiCard = this.aiController.selectCard(
      this.opponentDeck,
      this.stats,
      this.isPlayerTurn
    );

    // Show AI's card face-down (centered)
    this.opponentStagedCard = this.add
      .rectangle(375, 310, 120, 160, 0x333333)
      .setStrokeStyle(3, 0xff4444)
      .setDepth(100);

    this.opponentStagedCardBack = this.add
      .text(375, 310, "🂠", {
        fontSize: "100px",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Now reveal both cards
    this.time.delayedCall(1000, () => this.revealBothCards(aiCard));
  }

  revealBothCards(aiCard) {
    // Clear face-down placeholders
    if (this.playerStagedCard) this.playerStagedCard.destroy();
    if (this.playerStagedCardBack) this.playerStagedCardBack.destroy();
    if (this.opponentStagedCard) this.opponentStagedCard.destroy();
    if (this.opponentStagedCardBack) this.opponentStagedCardBack.destroy();

    // Show actual card names
    this.add
      .text(375, 700, this.selectedCard.card.name, {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#0066cc",
        padding: { x: 15, y: 15 },
        wordWrap: { width: 110 },
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .text(375, 300, aiCard.name, {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#cc0000",
        padding: { x: 15, y: 15 },
        wordWrap: { width: 110 },
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Apply card effects
    this.time.delayedCall(1500, () => {
      this.applyBothCardEffects(this.selectedCard.card, aiCard);
    });
  }

  applyBothCardEffects(playerCard, aiCard) {
    // Apply player card
    this.battleLog.addMessage(`► You played: ${playerCard.name}`, "#00aaff");
    this.stats = GameLogic.applyEffects(this.stats, playerCard.effects);

    // Apply AI card
    this.battleLog.addMessage(`► Enemy played: ${aiCard.name}`, "#ff4444");
    this.stats = GameLogic.applyEffects(this.stats, aiCard.effects);

    // Update UI
    this.updateStatBars();

    // Check win/loss
    if (this.checkGameOver()) {
      return;
    }

    // Reset for next turn
    this.selectedCard = null;
    this.isSelectingCard = false;
    this.turnInProgress = false;
    this.turnNumber++;

    // Draw new card
    const newCard = drawCards(this.playerDeck, 1)[0];
    if (newCard) {
      this.hand.push(newCard);
      this.cardHand.setCards(this.hand);
      this.cardHand.render();
    }

    this.battleLog.addMessage("► YOUR TURN", "#00ff00");
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
