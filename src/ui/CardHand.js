/**
 * CardHand - Manages card display and interaction
 */
export default class CardHand {
  constructor(scene) {
    this.scene = scene;
    this.cardObjects = [];
    this.cards = [];
    
    // Card layout constants
    this.CARD_WIDTH = 200;
    this.CARD_HEIGHT = 280;
    this.CARD_SPACING = 30;
    this.CARD_Y = 900;
  }

  setCards(cards) {
    this.cards = cards;
  }

  render() {
    // Clear existing card visuals
    this.cardObjects.forEach((obj) => obj.destroy());
    this.cardObjects = [];

    const centerX = this.scene.cameras.main.width / 2;
    const totalWidth = this.CARD_WIDTH * this.cards.length + this.CARD_SPACING * (this.cards.length - 1);
    const startX = centerX - totalWidth / 2;

    this.cards.forEach((card, index) => {
      const x = startX + (this.CARD_WIDTH + this.CARD_SPACING) * index;
      this.createCard(x, this.CARD_Y, card, index);
    });
  }

  createCard(x, y, cardData, cardIndex) {
    // Card background
    const cardBg = this.scene.add
      .rectangle(x, y, this.CARD_WIDTH, this.CARD_HEIGHT, 0x222222)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });

    // Card border
    const cardBorder = this.scene.add
      .rectangle(x, y, this.CARD_WIDTH, this.CARD_HEIGHT)
      .setOrigin(0, 0)
      .setStrokeStyle(4, 0xffffff);

    // Card name
    const nameText = this.scene.add
      .text(x + 100, y + 30, cardData.name, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 180 },
      })
      .setOrigin(0.5, 0);

    // Card description
    const descText = this.scene.add
      .text(x + 100, y + 100, cardData.description, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#cccccc",
        align: "center",
        wordWrap: { width: 180 },
      })
      .setOrigin(0.5, 0);

    // Display effects
    const effectText = this.formatEffects(cardData.effects);
    this.scene.add
      .text(x + 100, y + 180, effectText.join("\n"), {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#ffff00",
        align: "center",
      })
      .setOrigin(0.5, 0);

    // Hover effect
    cardBg.on("pointerover", () => cardBg.setFillStyle(0x444444));
    cardBg.on("pointerout", () => cardBg.setFillStyle(0x222222));

    // Store card objects for cleanup
    this.cardObjects.push(cardBg, cardBorder, nameText, descText);

    // Click to play card
    cardBg.on("pointerdown", () => {
      if (this.onCardPlayed) {
        this.onCardPlayed(cardData, cardIndex);
      }
    });
  }

  formatEffects(effects) {
    const effectText = [];
    
    if (effects.evidence !== 0) {
      effectText.push(`Evidence: ${effects.evidence > 0 ? "+" : ""}${effects.evidence}`);
    }
    if (effects.morale !== 0) {
      effectText.push(`Morale: ${effects.morale > 0 ? "+" : ""}${effects.morale}`);
    }
    if (effects.justiceInfluence !== 0) {
      effectText.push(`Justice: ${effects.justiceInfluence > 0 ? "+" : ""}${effects.justiceInfluence}`);
    }
    if (effects.suspicion !== 0) {
      effectText.push(`Suspicion: ${effects.suspicion > 0 ? "+" : ""}${effects.suspicion}`);
    }

    return effectText;
  }

  destroy() {
    this.cardObjects.forEach((obj) => obj.destroy());
    this.cardObjects = [];
  }
}
