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
    this.CARD_Y = 950; // Base Y position (moved up for better spacing)
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
    // Check if card is affordable
    const isAffordable =
      !cardData.energyCost || this.scene.playerEnergy >= cardData.energyCost;

    // Container for card (allows grouped transformations)
    const cardContainer = this.scene.add.container(
      x + this.CARD_WIDTH / 2,
      y + this.CARD_HEIGHT / 2
    );
    cardContainer.setRotation(rotation);
    cardContainer.setDepth(cardIndex); // Lower index cards behind higher ones

    // Card shadow for depth
    const shadow = this.scene.add
      .rectangle(3, 3, this.CARD_WIDTH, this.CARD_HEIGHT, 0x000000, 0.4)
      .setOrigin(0.5);

    // Card background with rounded appearance (gray out if unaffordable)
    const bgColor = isAffordable ? 0x2a2a2a : 0x1a1a1a;
    const cardBg = this.scene.add
      .rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT, bgColor)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: isAffordable });

    // Card border with gradient effect (dimmed if unaffordable)
    const borderColor = isAffordable ? 0xd4af37 : 0x555555;
    const cardBorder = this.scene.add
      .rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT)
      .setOrigin(0.5)
      .setStrokeStyle(3, borderColor); // Gold or gray border

    // Inner border for depth
    const innerBorder = this.scene.add
      .rectangle(0, 0, this.CARD_WIDTH - 10, this.CARD_HEIGHT - 10)
      .setOrigin(0.5)
      .setStrokeStyle(1, isAffordable ? 0x666666 : 0x333333);

    // Card name with better styling (dimmed if unaffordable)
    const nameColor = isAffordable ? "#ffffff" : "#666666";
    const nameText = this.scene.add
      .text(0, -100, cardData.name, {
        fontFamily: "Georgia, serif",
        fontSize: "18px",
        color: nameColor,
        align: "center",
        wordWrap: { width: 160 },
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Card description (dimmed if unaffordable)
    const descColor = isAffordable ? "#cccccc" : "#555555";
    const descText = this.scene.add
      .text(0, -40, cardData.description, {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: descColor,
        align: "center",
        wordWrap: { width: 160 },
      })
      .setOrigin(0.5);

    // Energy cost display with color coding
    let costColor = "#00ff00"; // Default green
    if (cardData.energyCost) {
      if (cardData.energyCost <= 3) costColor = "#00ff00"; // Green - Counter
      else if (cardData.energyCost <= 4) costColor = "#00ccff"; // Cyan - Quick
      else if (cardData.energyCost <= 5)
        costColor = "#ffff00"; // Yellow - Normal
      else if (cardData.energyCost <= 7)
        costColor = "#ff9900"; // Orange - Power
      else costColor = "#ff0000"; // Red - Ultimate
    }

    const costText = this.scene.add
      .text(0, 70, `⬢ ${cardData.energyCost || 0}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
        color: costColor,
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add all elements to container
    cardContainer.add([
      shadow,
      cardBg,
      cardBorder,
      innerBorder,
      nameText,
      descText,
      costText,
    ]);

    // Poker-style hover animations
    cardBg.on("pointerover", () => {
      // Don't animate if this card is locked in elevated state
      if (this.scene.lockedCardIndex === cardIndex) {
        return;
      }

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
      // Don't animate if this card is locked in elevated state
      if (this.scene.lockedCardIndex === cardIndex) {
        return;
      }

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

    // Click to select and lock card in elevated state
    cardBg.on("pointerdown", () => {
      if (this.onCardPlayed) {
        // Check if it's player's turn
        if (!this.scene.isPlayerTurn) {
          return;
        }
        if (this.scene.turnInProgress) {
          return;
        }

        // Check if card is affordable
        if (!isAffordable) {
          // Flash red to indicate unaffordable
          this.scene.tweens.add({
            targets: cardBorder,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 1,
          });
          return;
        }

        // Unlock previous card if any
        if (
          this.scene.lockedCardIndex !== null &&
          this.scene.lockedCardIndex !== cardIndex
        ) {
          this.unlockCard(this.scene.lockedCardIndex);
        }

        // Lock this card in elevated state
        this.scene.lockedCardIndex = cardIndex;

        // Ensure card is elevated and green
        cardContainer.setY(y + this.CARD_HEIGHT / 2 - this.HOVER_LIFT);
        cardContainer.setScale(this.HOVER_SCALE);
        cardContainer.setRotation(0);
        cardContainer.setDepth(100);
        cardBg.setFillStyle(0x2a5a2a); // Green tint
        cardBorder.setStrokeStyle(3, 0x00ff00); // Green border

        // Call the callback directly (selectCard) which will reposition buttons
        this.onCardPlayed(cardData, cardIndex);
      }
    });

    // Store card container for cleanup
    this.cardObjects.push(cardContainer);
  }

  unlockCard(cardIndex) {
    if (cardIndex < this.cardObjects.length) {
      const cardContainer = this.cardObjects[cardIndex];
      const cardBg = cardContainer.list[1]; // Background is second element after shadow
      const cardBorder = cardContainer.list[2]; // Border is third element

      // Calculate original position
      const numCards = this.cards.length;
      const centerX = this.scene.cameras.main.width / 2;
      const totalSpacing =
        (this.CARD_WIDTH + this.CARD_SPACING) * (numCards - 1);
      const startX = centerX - totalSpacing / 2;
      const x = startX + (this.CARD_WIDTH + this.CARD_SPACING) * cardIndex;
      const normalizedPos = (cardIndex - (numCards - 1) / 2) / (numCards - 1);
      const arcOffset = Math.abs(normalizedPos) * this.ARC_AMOUNT;
      const y = this.CARD_Y + arcOffset;
      const rotation = normalizedPos * 0.1;

      // Animate back to original position
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
      cardBorder.setStrokeStyle(3, 0xd4af37); // Reset to gold
    }

    this.scene.lockedCardIndex = null;
  }

  highlightCard(index) {
    // Highlight the selected card with green border
    this.cardObjects.forEach((cardContainer, i) => {
      // Get the border element (3rd child: shadow, bg, border)
      const border = cardContainer.list[2];
      if (i === index) {
        // Highlight selected card
        border.setStrokeStyle(4, 0x00ff00);
      } else {
        // Reset others to gold
        border.setStrokeStyle(3, 0xd4af37);
      }
    });
  }

  destroy() {
    this.cardObjects.forEach((obj) => obj.destroy());
    this.cardObjects = [];
  }

  // Returns the center position of a card container in scene coordinates
  getCardCenter(index) {
    const container = this.cardObjects[index];
    if (!container) return null;
    return { x: container.x, y: container.y };
  }
}
