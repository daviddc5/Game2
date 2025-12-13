import Phaser from "phaser";
import { getDeckForCharacter, drawCards } from "../data/cards.js";
import { getCharacter, getOpponent } from "../data/characters.js";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  create() {
    const playerCharacterName = this.registry.get("playerCharacter");

    // Get character data from config
    this.playerCharacter = getCharacter(playerCharacterName);
    this.opponentCharacter = getOpponent(playerCharacterName);

    const centerX = this.cameras.main.width / 2;

    // Title showing who you're playing as
    this.add
      .text(centerX, 60, `Playing as: ${this.playerCharacter.name}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "36px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Initialize stat values
    this.stats = {
      evidence: 50,
      publicPressure: 50,
      justiceInfluence: 50,
      suspicion: 50,
    };

    // Store stat bar references for updating
    this.statBars = {};
    this.statTexts = {};

    // Create the stat bars
    this.createStatBars();

    // Get both decks
    this.playerDeck = getDeckForCharacter(this.playerCharacter.name);
    this.opponentDeck = getDeckForCharacter(this.opponentCharacter.name);

    // Draw initial hands
    this.hand = drawCards(this.playerDeck, 3);
    this.cardObjects = []; // Track card visual objects

    // Display the cards
    this.createCardHand();
  }

  createStatBars() {
    // L's stats
    this.createStatBar(
      80,
      160,
      "+ Evidence",
      this.stats.evidence,
      0x00ff00,
      true,
      "evidence"
    );
    this.createStatBar(
      80,
      300,
      "- Public Pressure",
      this.stats.publicPressure,
      0xff0000,
      false,
      "publicPressure"
    );

    // Kira's stats
    this.createStatBar(
      80,
      500,
      "+ Justice Influence",
      this.stats.justiceInfluence,
      0x00ff00,
      true,
      "justiceInfluence"
    );
    this.createStatBar(
      80,
      640,
      "- Suspicion",
      this.stats.suspicion,
      0xff0000,
      false,
      "suspicion"
    );
  }

  createStatBar(x, y, label, value, color, isPositive, statKey) {
    //Label for the Stat (with +/- prefix)
    this.add
      .text(x, y, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    // Background bar (dark gray)
    this.add.rectangle(x, y + 50, 500, 48, 0x333333).setOrigin(0, 0.5);

    // Foreground bar (store reference for updating)
    const bar = this.add
      .rectangle(x, y + 50, (value / 100) * 500, 48, color)
      .setOrigin(0, 0.5);

    this.statBars[statKey] = { bar, color, x, y: y + 50 };

    // Value text (store reference for updating)
    const valueText = this.add
      .text(x + 520, y + 50, value, {
        fontFamily: "Arial, sans-serif",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    this.statTexts[statKey] = valueText;
  }

  createCardHand() {
    // Clear existing card visuals
    this.cardObjects.forEach((obj) => obj.destroy());
    this.cardObjects = [];

    const startY = 900;
    const cardWidth = 200;
    const cardHeight = 280;
    const spacing = 30;
    const centerX = this.cameras.main.width / 2;

    // Calculate starting X position to center the 3 cards
    const totalWidth = cardWidth * 3 + spacing * 2;
    let startX = centerX - totalWidth / 2;

    this.hand.forEach((card, index) => {
      const x = startX + (cardWidth + spacing) * index;
      this.createCard(x, startY, card, index);
    });
  }

  createCard(x, y, cardData, cardIndex) {
    // Card background (dark rectangle)
    const cardBg = this.add
      .rectangle(x, y, 200, 280, 0x222222)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });

    // Card border
    const cardBorder = this.add
      .rectangle(x, y, 200, 280)
      .setOrigin(0, 0)
      .setStrokeStyle(4, 0xffffff);

    // Card name
    const nameText = this.add
      .text(x + 100, y + 30, cardData.name, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 180 },
      })
      .setOrigin(0.5, 0);

    // Card description
    const descText = this.add
      .text(x + 100, y + 100, cardData.description, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#cccccc",
        align: "center",
        wordWrap: { width: 180 },
      })
      .setOrigin(0.5, 0);

    // Display effects
    let effectY = y + 180;
    const effects = cardData.effects;
    const effectText = [];

    if (effects.evidence !== 0)
      effectText.push(
        `Evidence: ${effects.evidence > 0 ? "+" : ""}${effects.evidence}`
      );
    if (effects.publicPressure !== 0)
      effectText.push(
        `Pressure: ${effects.publicPressure > 0 ? "+" : ""}${
          effects.publicPressure
        }`
      );
    if (effects.justiceInfluence !== 0)
      effectText.push(
        `Justice: ${effects.justiceInfluence > 0 ? "+" : ""}${
          effects.justiceInfluence
        }`
      );
    if (effects.suspicion !== 0)
      effectText.push(
        `Suspicion: ${effects.suspicion > 0 ? "+" : ""}${effects.suspicion}`
      );

    this.add
      .text(x + 100, effectY, effectText.join("\n"), {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#ffff00",
        align: "center",
      })
      .setOrigin(0.5, 0);

    // Hover effect
    cardBg.on("pointerover", () => {
      cardBg.setFillStyle(0x444444);
    });

    cardBg.on("pointerout", () => {
      cardBg.setFillStyle(0x222222);
    });

    // Store card objects for cleanup
    this.cardObjects.push(cardBg, cardBorder, nameText, descText);

    // Click to play card
    cardBg.on("pointerdown", () => {
      this.playCard(cardData, cardIndex);
    });
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
    // Update stats
    this.stats.evidence = Math.max(
      0,
      Math.min(100, this.stats.evidence + effects.evidence)
    );
    this.stats.publicPressure = Math.max(
      0,
      Math.min(100, this.stats.publicPressure + effects.publicPressure)
    );
    this.stats.justiceInfluence = Math.max(
      0,
      Math.min(100, this.stats.justiceInfluence + effects.justiceInfluence)
    );
    this.stats.suspicion = Math.max(
      0,
      Math.min(100, this.stats.suspicion + effects.suspicion)
    );

    // Update visual bars
    this.updateStatBars();
  }

  updateStatBars() {
    Object.keys(this.stats).forEach((statKey) => {
      const value = this.stats[statKey];
      const barData = this.statBars[statKey];
      const textObj = this.statTexts[statKey];

      // Update bar width
      barData.bar.width = (value / 100) * 500;

      // Update text
      textObj.setText(Math.round(value));
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
    // Get AI's stats from character config
    const positiveStats = this.opponentCharacter.positiveStats;
    const negativeStats = this.opponentCharacter.negativeStats;

    // Score each card
    const scoredCards = cards.map((card) => {
      let score = 0;
      const effects = card.effects;

      // Reward cards that increase AI's positive stats
      positiveStats.forEach((stat) => {
        score += effects[stat] * 2; // 2x weight for positive stats
      });

      // Reward cards that decrease AI's negative stats
      negativeStats.forEach((stat) => {
        score -= effects[stat] * 2; // Negative decrease = good
      });

      // Penalize cards that hurt the AI
      negativeStats.forEach((stat) => {
        if (effects[stat] > 0) {
          score -= effects[stat] * 3; // 3x penalty for increasing negative stat
        }
      });

      // CRITICAL: If AI's negative stat is high (>80), prioritize reducing it
      negativeStats.forEach((stat) => {
        if (this.stats[stat] > 80 && effects[stat] < 0) {
          score += Math.abs(effects[stat]) * 5; // 5x bonus for emergency defense
        }
      });

      // CRITICAL: If AI is close to winning, go for the win
      positiveStats.forEach((stat) => {
        if (this.stats[stat] > 80 && effects[stat] > 0) {
          score += effects[stat] * 5; // 5x bonus for finishing move
        }
      });

      return { card, score };
    });

    // Sort by score (highest first) and return best card
    scoredCards.sort((a, b) => b.score - a.score);

    console.log(
      "AI card scores:",
      scoredCards.map((sc) => `${sc.card.name}: ${sc.score}`)
    );

    return scoredCards[0].card;
  }

  checkGameOver() {
    // Check L win condition
    if (this.stats.evidence >= 100) {
      console.log("L WINS - Evidence reached 100!");
      this.gameOver("Detective L");
      return true;
    }

    // Check L loss condition
    if (this.stats.publicPressure >= 100) {
      console.log("L LOSES - Public Pressure reached 100!");
      this.gameOver("Kira");
      return true;
    }

    // Check Kira win condition
    if (this.stats.justiceInfluence >= 100) {
      console.log("KIRA WINS - Justice Influence reached 100!");
      this.gameOver("Kira");
      return true;
    }

    // Check Kira loss condition
    if (this.stats.suspicion >= 100) {
      console.log("KIRA LOSES - Suspicion reached 100!");
      this.gameOver("Detective L");
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
