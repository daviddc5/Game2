/**
 * CardHand - Manages card display and interaction with poker-style effects
 */
export default class CardHand {
  constructor(scene) {
    this.scene = scene;
    this.cardObjects = [];
    this.cards = [];

    // Card layout constants
    this.CARD_WIDTH = 180;
    this.CARD_HEIGHT = 260;
    this.CARD_SPACING = -40; // Negative for overlapping poker style
    this.CARD_Y = 1050; // Base Y position
    this.HOVER_LIFT = 80; // How much card lifts on hover
    this.HOVER_SCALE = 1.15; // Scale multiplier on hover
    this.ARC_AMOUNT = 15; // Arc curvature for fan effect
  }

  setCards(cards) {
    this.cards = cards;
  }

  render() {
    // Clear existing card visuals
    this.cardObjects.forEach((obj) => obj.destroy());
    this.cardObjects = [];

    const centerX = this.scene.cameras.main.width / 2;
    const numCards = this.cards.length;
    
    // Calculate spacing for poker-style fan
    const totalSpacing = (this.CARD_WIDTH + this.CARD_SPACING) * (numCards - 1);
    const startX = centerX - totalSpacing / 2;

    this.cards.forEach((card, index) => {
      const x = startX + (this.CARD_WIDTH + this.CARD_SPACING) * index;
      
      // Create arc effect - middle cards lower, edge cards higher
      const normalizedPos = (index - (numCards - 1) / 2) / (numCards - 1);
      const arcOffset = Math.abs(normalizedPos) * this.ARC_AMOUNT;
      const y = this.CARD_Y + arcOffset;
      
      // Slight rotation for fan effect
      const rotation = normalizedPos * 0.1;
      
      this.createCard(x, y, card, index, rotation);
    });
  }

  createCard(x, y, cardData, cardIndex, rotation = 0) {
    // Container for card (allows grouped transformations)
    const cardContainer = this.scene.add.container(x + this.CARD_WIDTH / 2, y + this.CARD_HEIGHT / 2);
    cardContainer.setRotation(rotation);
    cardContainer.setDepth(cardIndex); // Lower index cards behind higher ones
    
    // Card shadow for depth
    const shadow = this.scene.add
      .rectangle(3, 3, this.CARD_WIDTH, this.CARD_HEIGHT, 0x000000, 0.4)
      .setOrigin(0.5);
    
    // Card background with rounded appearance
    const cardBg = this.scene.add
      .rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT, 0x2a2a2a)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Card border with gradient effect
    const cardBorder = this.scene.add
      .rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT)
      .setOrigin(0.5)
      .setStrokeStyle(3, 0xd4af37); // Gold border

    // Inner border for depth
    const innerBorder = this.scene.add
      .rectangle(0, 0, this.CARD_WIDTH - 10, this.CARD_HEIGHT - 10)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0x666666);

    // Card name with better styling
    const nameText = this.scene.add
      .text(0, -100, cardData.name, {
        fontFamily: "Georgia, serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 160 },
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Card description
    const descText = this.scene.add
      .text(0, -40, cardData.description, {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#cccccc",
        align: "center",
        wordWrap: { width: 160 },
      })
      .setOrigin(0.5);

    // Display effects with icons/colors
    const effectText = this.formatEffects(cardData.effects);
    const effectsDisplay = this.scene.add
      .text(0, 50, effectText.join("\n"), {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#ffd700",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add all elements to container
    cardContainer.add([shadow, cardBg, cardBorder, innerBorder, nameText, descText, effectsDisplay]);

    // Poker-style hover animations
    cardBg.on("pointerover", () => {
      this.scene.tweens.add({
        targets: cardContainer,
        y: y + this.CARD_HEIGHT / 2 - this.HOVER_LIFT,
        scale: this.HOVER_SCALE,
        rotation: 0, // Straighten card on hover
        duration: 200,
        ease: "Power2",
      });
      cardContainer.setDepth(100); // Bring to front
      cardBg.setFillStyle(0x3a3a3a);
    });

    cardBg.on("pointerout", () => {
      this.scene.tweens.add({
        targets: cardContainer,
        y: y + this.CARD_HEIGHT / 2,
        scale: 1,
        rotation: rotation,
        duration: 200,
        ease: "Power2",
      });
      cardContainer.setDepth(cardIndex);
      cardBg.setFillStyle(0x2a2a2a);
    });

    // Click to play card with animation
    cardBg.on("pointerdown", () => {
      if (this.onCardPlayed) {
        // Play card animation
        this.scene.tweens.add({
          targets: cardContainer,
          y: y - 200,
          alpha: 0,
          scale: 0.8,
          duration: 300,
          ease: "Power2",
          onComplete: () => {
            this.onCardPlayed(cardData, cardIndex);
          },
        });
      }
    });

    // Store card container for cleanup
    this.cardObjects.push(cardContainer);
  }

  formatEffects(effects) {
    const effectText = [];

    if (effects.evidence !== 0) {
      effectText.push(
        `Evidence: ${effects.evidence > 0 ? "+" : ""}${effects.evidence}`
      );
    }
    if (effects.morale !== 0) {
      effectText.push(
        `Morale: ${effects.morale > 0 ? "+" : ""}${effects.morale}`
      );
    }
    if (effects.justiceInfluence !== 0) {
      effectText.push(
        `Justice: ${effects.justiceInfluence > 0 ? "+" : ""}${
          effects.justiceInfluence
        }`
      );
    }
    if (effects.suspicion !== 0) {
      effectText.push(
        `Suspicion: ${effects.suspicion > 0 ? "+" : ""}${effects.suspicion}`
      );
    }

    return effectText;
  }

  destroy() {
    this.cardObjects.forEach((obj) => obj.destroy());
    this.cardObjects = [];
  }
}
