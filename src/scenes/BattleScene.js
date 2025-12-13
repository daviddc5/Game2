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
    this.add
      .text(centerX, 60, `Playing as: ${this.playerCharacter.name}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "36px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
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

    // Left side - Player portrait (above stat bars)
    const leftPortrait = this.add.image(150, 280, playerPortrait);
    leftPortrait.setScale(0.3); // Adjust size
    leftPortrait.setBlendMode(Phaser.BlendModes.SCREEN); // Blend white background with black

    // Flip Kira to face right if player is Kira
    if (playerPortrait === "kira-portrait") {
      leftPortrait.setFlipX(true);
    }

    // Add label below player portrait
    this.add
      .text(150, 420, this.playerCharacter.displayName, {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Right side - Opponent portrait (above stat bars)
    const rightPortrait = this.add.image(600, 280, opponentPortrait);
    rightPortrait.setScale(0.3); // Adjust size
    rightPortrait.setBlendMode(Phaser.BlendModes.SCREEN); // Blend white background with black

    // Flip Kira to face right
    if (opponentPortrait === "kira-portrait") {
      rightPortrait.setFlipX(true);
    }

    // Add label below opponent portrait
    this.add
      .text(600, 420, this.opponentCharacter.displayName, {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
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

    // Left side (player)
    const leftStats = playerIsL ? lStats : kiraStats;
    this.leftStatGroup = new StatBarGroup(this, 30, 480, leftStats, true);
    this.leftStatGroup.create();

    // Right side (opponent)
    const rightStats = playerIsL ? kiraStats : lStats;
    this.rightStatGroup = new StatBarGroup(this, 410, 480, rightStats, false);
    this.rightStatGroup.create();

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

    // AI turn after short delay
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

    // Check win/loss
    this.checkGameOver();
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
