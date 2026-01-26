import Phaser from "phaser";
import { getDeckForCharacter, drawCards } from "../data/cards.js";
import { getCharacter, getOpponent } from "../data/characters.js";
import StatBarGroup from "../ui/StatBarGroup.js";
import CardHand from "../ui/CardHand.js";
import StatsModal from "../ui/StatsModal.js";
import GameLogic from "../logic/GameLogic.js";
import AIController from "../logic/AIController.js";
import CardResolver from "../logic/CardResolver.js";
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
    this.createEnergyDisplays();
    this.createCardHand();
    this.createStagingArea();
    this.selectedCard = null; // track which card is selected
    this.isSelectingCard = false; // track if player is in card selection mode

    // Initialize StatsModal
    this.statsModal = new StatsModal(this);

    // Check if PASS button should be shown initially
    this.updatePassButtonVisibility();
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

    // Initialize separate stat values for each player
    this.playerStats = {
      investigation: 50,
      morale: 50,
      publicOpinion: 50,
      pressure: 50,
    };

    this.opponentStats = {
      investigation: 50,
      morale: 50,
      publicOpinion: 50,
      pressure: 50,
    };

    // Keep legacy stats for backward compatibility (will update UI progressively)
    this.stats = this.playerStats;

    // Initialize energy system
    this.playerEnergy = 5;
    this.opponentEnergy = 5;
    this.maxEnergy = 20;

    // Get both decks
    this.playerDeck = getDeckForCharacter(this.playerCharacter.name);
    this.opponentDeck = getDeckForCharacter(this.opponentCharacter.name);

    // Draw initial hands
    this.hand = drawCards(this.playerDeck, 4);

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
    this.opponentPortrait.setInteractive({ useHandCursor: true });
    this.opponentPortrait.on("pointerdown", () => {
      this.showStatsModal("opponent");
    });

    this.add
      .text(160, 75, this.opponentCharacter.displayName, {
        fontSize: "16px",
        color: "#ff4444",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // PLAYER at bottom right (compact)
    this.playerPortrait = this.add.image(600, 780, playerPortrait);
    this.playerPortrait.setScale(0.15); // Smaller
    this.playerPortrait.setFlipX(true);
    this.playerPortrait.setInteractive({ useHandCursor: true });
    this.playerPortrait.on("pointerdown", () => {
      this.showStatsModal("player");
    });

    this.add
      .text(520, 780, this.playerCharacter.displayName, {
        fontSize: "16px",
        color: "#00aaff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0.5);
  }

  createStatBars() {
    // Get stat configurations from character data
    const playerStatConfigs = [
      {
        key: "investigation",
        label: this.playerCharacter.statLabels.investigation,
        color: this.playerCharacter.statColors.investigation.color,
        isPositive: this.playerCharacter.statColors.investigation.isGreen,
      },
      {
        key: "morale",
        label: this.playerCharacter.statLabels.morale,
        color: this.playerCharacter.statColors.morale.color,
        isPositive: this.playerCharacter.statColors.morale.isGreen,
      },
      {
        key: "publicOpinion",
        label: this.playerCharacter.statLabels.publicOpinion,
        color: this.playerCharacter.statColors.publicOpinion.color,
        isPositive: this.playerCharacter.statColors.publicOpinion.isGreen,
      },
      {
        key: "pressure",
        label: this.playerCharacter.statLabels.pressure,
        color: this.playerCharacter.statColors.pressure.color,
        isPositive: this.playerCharacter.statColors.pressure.isGreen,
      },
    ];

    const opponentStatConfigs = [
      {
        key: "investigation",
        label: this.opponentCharacter.statLabels.investigation,
        color: this.opponentCharacter.statColors.investigation.color,
        isPositive: this.opponentCharacter.statColors.investigation.isGreen,
      },
      {
        key: "morale",
        label: this.opponentCharacter.statLabels.morale,
        color: this.opponentCharacter.statColors.morale.color,
        isPositive: this.opponentCharacter.statColors.morale.isGreen,
      },
      {
        key: "publicOpinion",
        label: this.opponentCharacter.statLabels.publicOpinion,
        color: this.opponentCharacter.statColors.publicOpinion.color,
        isPositive: this.opponentCharacter.statColors.publicOpinion.isGreen,
      },
      {
        key: "pressure",
        label: this.opponentCharacter.statLabels.pressure,
        color: this.opponentCharacter.statColors.pressure.color,
        isPositive: this.opponentCharacter.statColors.pressure.isGreen,
      },
    ];

    // Sort stats: green (positive) first, then red (negative)
    const sortedPlayerStats = playerStatConfigs.sort((a, b) => {
      if (a.isPositive && !b.isPositive) return -1;
      if (!a.isPositive && b.isPositive) return 1;
      return 0;
    });

    const sortedOpponentStats = opponentStatConfigs.sort((a, b) => {
      if (a.isPositive && !b.isPositive) return -1;
      if (!a.isPositive && b.isPositive) return 1;
      return 0;
    });

    // Opponent stats (below portrait at top, pushed down)
    this.opponentStatGroup = new StatBarGroup(
      this,
      20,
      220,
      sortedOpponentStats,
      false,
    );
    this.opponentStatGroup.create();

    // Player stats (above portrait at bottom right)
    this.playerStatGroup = new StatBarGroup(
      this,
      520,
      460,
      sortedPlayerStats,
      true,
    );
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

  createEnergyDisplays() {
    // Opponent energy (next to portrait, in line with stats)
    const opponentEnergyY = 160; // In line with top of stats
    this.opponentEnergyText = this.add
      .text(20, opponentEnergyY, this.getEnergyString(this.opponentEnergy), {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Player energy (higher up, closer to stats)
    const playerEnergyY = 690; // More separation from stats
    this.playerEnergyText = this.add
      .text(520, playerEnergyY, this.getEnergyString(this.playerEnergy), {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Opponent deck counter (below energy)
    this.opponentDeckCounterText = this.add
      .text(20, opponentEnergyY + 35, `Deck: ${this.opponentDeck.length}`, {
        fontSize: "18px",
        color: "#aaaaaa",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Player deck counter (below energy)
    this.playerDeckCounterText = this.add
      .text(520, playerEnergyY + 35, `Deck: ${this.playerDeck.length}`, {
        fontSize: "18px",
        color: "#aaaaaa",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);
  }

  getEnergyString(energy) {
    return `Energy: ⬢ ${energy}/${this.maxEnergy}`;
  }

  updateEnergyDisplay() {
    if (this.playerEnergyText) {
      this.playerEnergyText.setText(this.getEnergyString(this.playerEnergy));
    }
    if (this.opponentEnergyText) {
      this.opponentEnergyText.setText(
        this.getEnergyString(this.opponentEnergy),
      );
    }
  }

  updateDeckCounter() {
    if (this.playerDeckCounterText) {
      this.playerDeckCounterText.setText(`Deck: ${this.playerDeck.length}`);
    }
    if (this.opponentDeckCounterText) {
      this.opponentDeckCounterText.setText(`Deck: ${this.opponentDeck.length}`);
    }
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
      return;
    }

    // Block if turn already in progress
    if (this.turnInProgress) {
      return;
    }

    //select card without playing it
    this.selectedCard = { card, cardIndex };
    this.isSelectingCard = true;

    //Show the confirm button
    if (!this.confirmButton) {
      this.createConfirmButton();
    }
    // Position the buttons above the selected card (which is now locked elevated)
    this.positionActionButtonsAtCard(cardIndex);
    this.confirmButton.setVisible(true);
  }

  createConfirmButton() {
    // Create container for both buttons (no backdrop)
    this.cardActionButtons = this.add.container(375, 850);
    this.cardActionButtons.setDepth(1000);
    this.cardActionButtons.setVisible(false);

    // VIEW button (left) - Circular with glow
    const viewButtonGlow = this.add.circle(-60, 0, 45, 0x4444ff, 0.6);
    const viewButtonBg = this.add.circle(-60, 0, 38, 0x4444ff);
    const viewButtonText = this.add
      .text(-60, 0, "👁", {
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    const viewLabel = this.add
      .text(-60, 28, "VIEW", {
        fontSize: "11px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    viewButtonBg.setInteractive({ useHandCursor: true });
    viewButtonBg.on("pointerdown", () => {
      this.showEnlargedCardView();
    });
    viewButtonBg.on("pointerover", () => {
      viewButtonBg.setFillStyle(0x6666ff);
      viewButtonGlow.setFillStyle(0x6666ff, 0.8);
    });
    viewButtonBg.on("pointerout", () => {
      viewButtonBg.setFillStyle(0x4444ff);
      viewButtonGlow.setFillStyle(0x4444ff, 0.6);
    });

    // CONFIRM button (right) - Circular with glow
    const confirmButtonGlow = this.add.circle(60, 0, 45, 0x00aa00, 0.6);
    const confirmButtonBg = this.add.circle(60, 0, 38, 0x00aa00);
    const confirmButtonText = this.add
      .text(60, 0, "▶", {
        fontSize: "26px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    const confirmLabel = this.add
      .text(60, 28, "PLAY", {
        fontSize: "11px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    confirmButtonBg.setInteractive({ useHandCursor: true });
    confirmButtonBg.on("pointerdown", () => {
      this.confirmCardPlay();
    });
    confirmButtonBg.on("pointerover", () => {
      confirmButtonBg.setFillStyle(0x00ff00);
      confirmButtonGlow.setFillStyle(0x00ff00, 0.8);
    });
    confirmButtonBg.on("pointerout", () => {
      confirmButtonBg.setFillStyle(0x00aa00);
      confirmButtonGlow.setFillStyle(0x00aa00, 0.6);
    });

    // Add buttons to container (no backdrop)
    this.cardActionButtons.add([
      viewButtonGlow,
      viewButtonBg,
      viewButtonText,
      viewLabel,
      confirmButtonGlow,
      confirmButtonBg,
      confirmButtonText,
      confirmLabel,
    ]);

    // Store references for later use
    this.confirmButton = this.cardActionButtons; // Keep reference for compatibility
  }

  // Position the action buttons above the elevated card
  positionActionButtonsAtCard(cardIndex) {
    if (!this.cardHand || !this.cardActionButtons) return;
    const center = this.cardHand.getCardCenter
      ? this.cardHand.getCardCenter(cardIndex)
      : null;
    if (!center) return;

    // Position above the elevated card (HOVER_LIFT = 80px)
    const elevatedY = center.y - 80; // Card moves up 80px when elevated
    const buttonY =
      elevatedY -
      (this.cardHand.CARD_HEIGHT * this.cardHand.HOVER_SCALE) / 2 -
      10; // Above the scaled card, very close

    this.cardActionButtons.setPosition(center.x, buttonY);
    this.cardActionButtons.setDepth(1500);
    this.cardActionButtons.setAlpha(1);
  }

  createStagingArea() {
    // Enemy card placeholder at top center
    this.add
      .rectangle(375, 310, 120, 160, 0x1a1a1a)
      .setStrokeStyle(2, 0xff4444, 0.5)
      .setOrigin(0.5)
      .setDepth(50);

    // Player card placeholder at bottom center
    this.add
      .rectangle(375, 600, 120, 160, 0x1a1a1a)
      .setStrokeStyle(2, 0x00aaff, 0.5)
      .setOrigin(0.5)
      .setDepth(50);

    // Placeholders for face-down cards (will show later)
    this.playerStagedCard = null;
    this.opponentStagedCard = null;

    // Store references to revealed card display objects for cleanup
    this.revealedPlayerCardObjects = [];
    this.revealedOpponentCardObjects = [];

    // Create PASS button (initially hidden)
    this.createPassButton();
  }

  createPassButton() {
    // Create PASS button (left side near player stats, gray, initially hidden)
    this.passButtonBg = this.add
      .rectangle(100, 780, 140, 50, 0x555555)
      .setDepth(150)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.passButtonText = this.add
      .text(100, 780, "PASS ⏭", {
        fontSize: "20px",
        color: "#cccccc",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(151)
      .setVisible(false);

    this.passButtonBg.on("pointerdown", () => {
      this.handlePass();
    });
    this.passButtonBg.on("pointerover", () => {
      this.passButtonBg.setFillStyle(0x777777);
    });
    this.passButtonBg.on("pointerout", () => {
      this.passButtonBg.setFillStyle(0x555555);
    });
  }

  handlePass() {
    if (this.turnInProgress || !this.isPlayerTurn) return;

    // Clear previous revealed cards (including glow effects)
    if (this.revealedPlayerCardObjects) {
      this.revealedPlayerCardObjects.forEach((obj) => obj.destroy());
      this.revealedPlayerCardObjects = [];
    }
    if (this.revealedOpponentCardObjects) {
      this.revealedOpponentCardObjects.forEach((obj) => obj.destroy());
      this.revealedOpponentCardObjects = [];
    }

    // Hide pass button
    this.passButtonBg.setVisible(false);
    this.passButtonText.setVisible(false);

    // Lock the turn
    this.turnInProgress = true;

    // Show player "passed" in staging area
    this.playerStagedCard = this.add
      .rectangle(375, 600, 120, 160, 0x333333)
      .setStrokeStyle(3, 0x888888)
      .setDepth(100);

    this.playerStagedCardBack = this.add
      .text(375, 600, "PASS", {
        fontSize: "20px",
        color: "#888888",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Trigger AI turn
    this.time.delayedCall(800, () => {
      this.aiSelectCard();
    });
  }

  updatePassButtonVisibility() {
    // Always show PASS button when it's player's turn and no turn in progress
    if (!this.isPlayerTurn || this.turnInProgress) {
      this.passButtonBg.setVisible(false);
      this.passButtonText.setVisible(false);
      return;
    }

    // Show button during player turn
    this.passButtonBg.setVisible(true);
    this.passButtonText.setVisible(true);
  }

  showStatsModal(target) {
    // Prevent opening during card selection or turn in progress
    if (this.enlargedCardObjects || this.turnInProgress) return;

    const character =
      target === "player" ? this.playerCharacter : this.opponentCharacter;
    this.statsModal.show(target, character, this.stats);
  }

  closeStatsModal() {
    this.statsModal.close();
  }

  showEnlargedCardView() {
    // Use hovered card if available, otherwise use selected card
    const cardData =
      this.hoveredCard || (this.selectedCard ? this.selectedCard.card : null);
    if (!cardData) return;

    // Hide action buttons while viewing enlarged card
    if (this.cardActionButtons) {
      this.cardActionButtons.setVisible(false);
    }

    const card = cardData;

    // Create dark overlay background (fullscreen)
    this.enlargedViewOverlay = this.add
      .rectangle(375, 667, 750, 1334, 0x000000, 0.95)
      .setOrigin(0.5)
      .setDepth(2000)
      .setInteractive(); // Block clicks behind it

    // Create enlarged card container (fullscreen, centered)
    const cardWidth = 700;
    const cardHeight = 1000;
    const cardX = 375;
    const cardY = 600; // Centered vertically in 1334px height screen

    // Card background
    const cardBg = this.add
      .rectangle(cardX, cardY, cardWidth, cardHeight, 0x2a2a2a)
      .setOrigin(0.5)
      .setDepth(2001);

    // Card border
    const cardBorder = this.add
      .rectangle(cardX, cardY, cardWidth, cardHeight)
      .setOrigin(0.5)
      .setStrokeStyle(4, 0xd4af37)
      .setDepth(2001);

    // Card name
    const nameText = this.add
      .text(cardX, cardY - 220, card.name, {
        fontFamily: "Georgia, serif",
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: cardWidth - 40 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(2002);

    // Card description
    const descText = this.add
      .text(cardX, cardY - 100, card.description, {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
        color: "#cccccc",
        align: "center",
        wordWrap: { width: cardWidth - 60 },
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(2002);

    // Energy cost and speed display
    const energyCostText = this.add
      .text(cardX - 100, cardY - 20, `Energy: ⬢ ${card.energyCost || 0}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(2002);

    const speedText = this.add
      .text(cardX + 100, cardY - 20, `Speed: S ${card.speed || 0}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#ffd700",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(2002);

    // Format and display effects - show both self and opponent effects
    const effectLines = [];
    effectLines.push("━━━ You ━━━");
    if (card.selfEffects.investigation !== 0) {
      effectLines.push(
        `${this.playerCharacter.statLabels.investigation}: ${card.selfEffects.investigation > 0 ? "+" : ""}${
          card.selfEffects.investigation
        }`,
      );
    }
    if (card.selfEffects.morale !== 0) {
      effectLines.push(
        `${this.playerCharacter.statLabels.morale}: ${card.selfEffects.morale > 0 ? "+" : ""}${
          card.selfEffects.morale
        }`,
      );
    }
    if (card.selfEffects.publicOpinion !== 0) {
      effectLines.push(
        `${this.playerCharacter.statLabels.publicOpinion}: ${card.selfEffects.publicOpinion > 0 ? "+" : ""}${
          card.selfEffects.publicOpinion
        }`,
      );
    }
    if (card.selfEffects.pressure !== 0) {
      effectLines.push(
        `${this.playerCharacter.statLabels.pressure}: ${card.selfEffects.pressure > 0 ? "+" : ""}${
          card.selfEffects.pressure
        }`,
      );
    }

    effectLines.push("━━━ Foe ━━━");
    if (card.opponentEffects.investigation !== 0) {
      effectLines.push(
        `${this.opponentCharacter.statLabels.investigation}: ${card.opponentEffects.investigation > 0 ? "+" : ""}${
          card.opponentEffects.investigation
        }`,
      );
    }
    if (card.opponentEffects.morale !== 0) {
      effectLines.push(
        `${this.opponentCharacter.statLabels.morale}: ${card.opponentEffects.morale > 0 ? "+" : ""}${
          card.opponentEffects.morale
        }`,
      );
    }
    if (card.opponentEffects.publicOpinion !== 0) {
      effectLines.push(
        `${this.opponentCharacter.statLabels.publicOpinion}: ${card.opponentEffects.publicOpinion > 0 ? "+" : ""}${
          card.opponentEffects.publicOpinion
        }`,
      );
    }
    if (card.opponentEffects.pressure !== 0) {
      effectLines.push(
        `${this.opponentCharacter.statLabels.pressure}: ${card.opponentEffects.pressure > 0 ? "+" : ""}${
          card.opponentEffects.pressure
        }`,
      );
    }

    const effectsText = this.add
      .text(cardX, cardY + 100, effectLines.join("\n"), {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
        color: "#ffd700",
        align: "center",
        fontStyle: "bold",
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(2002);

    // Go Back button (left, at bottom)
    const backButtonBg = this.add
      .rectangle(250, 1200, 180, 60, 0x666666)
      .setDepth(2003)
      .setInteractive({ useHandCursor: true });

    const backButtonText = this.add
      .text(250, 1200, "← Go Back", {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(2004);

    // Back button interactions
    backButtonBg.on("pointerdown", () => {
      this.closeEnlargedCardView();
    });
    backButtonBg.on("pointerover", () => {
      backButtonBg.setFillStyle(0x888888);
    });
    backButtonBg.on("pointerout", () => {
      backButtonBg.setFillStyle(0x666666);
    });

    // Confirm button (right, at bottom)
    const confirmButtonBg = this.add
      .rectangle(500, 1200, 180, 60, 0x00aa00)
      .setDepth(2003)
      .setInteractive({ useHandCursor: true });

    const confirmButtonText = this.add
      .text(500, 1200, "Play ▶", {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(2004);

    // Confirm button interactions
    confirmButtonBg.on("pointerdown", () => {
      this.confirmCardPlay();
    });
    confirmButtonBg.on("pointerover", () => {
      confirmButtonBg.setFillStyle(0x00ff00);
    });
    confirmButtonBg.on("pointerout", () => {
      confirmButtonBg.setFillStyle(0x00aa00);
    });

    // Store all enlarged view elements for cleanup
    this.enlargedViewElements = [
      this.enlargedViewOverlay,
      cardBg,
      cardBorder,
      nameText,
      descText,
      energyCostText,
      speedText,
      effectsText,
      backButtonBg,
      backButtonText,
      confirmButtonBg,
      confirmButtonText,
    ];
  }

  closeEnlargedCardView() {
    // Destroy all enlarged view elements
    if (this.enlargedViewElements) {
      this.enlargedViewElements.forEach((element) => element.destroy());
      this.enlargedViewElements = null;
    }
    if (this.enlargedViewOverlay) {
      this.enlargedViewOverlay = null;
    }

    // Restore action buttons if still selecting a card
    if (this.isSelectingCard && this.cardActionButtons && this.selectedCard) {
      this.positionActionButtonsAtCard(this.selectedCard.cardIndex);
      this.cardActionButtons.setVisible(true);
    }
  }

  confirmCardPlay() {
    // Use hovered card info if available, otherwise use selected card
    if (!this.hoveredCard && !this.selectedCard) return;

    if (this.hoveredCard && this.hoveredCardIndex !== undefined) {
      // Set as selected card from hover
      this.selectedCard = {
        card: this.hoveredCard,
        cardIndex: this.hoveredCardIndex,
      };
    }

    if (!this.selectedCard) return;

    // Check if player has enough energy
    const energyCost = this.selectedCard.card.energyCost || 0;
    if (this.playerEnergy < energyCost) {
      console.log("Not enough energy!");
      return;
    }

    // Clear previous revealed cards (including glow effects)
    if (this.revealedPlayerCardObjects) {
      this.revealedPlayerCardObjects.forEach((obj) => obj.destroy());
      this.revealedPlayerCardObjects = [];
    }
    if (this.revealedOpponentCardObjects) {
      this.revealedOpponentCardObjects.forEach((obj) => obj.destroy());
      this.revealedOpponentCardObjects = [];
    }

    // Close enlarged view if open
    this.closeEnlargedCardView();

    // Hide buttons after confirming
    if (this.confirmButton) {
      this.confirmButton.setVisible(false);
    }

    // Lock the turn
    this.turnInProgress = true;

    // Deduct energy cost
    this.playerEnergy -= energyCost;
    this.updateEnergyDisplay();
    this.updatePassButtonVisibility();

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
    // AI picks a card it can afford
    const aiCard = this.aiController.selectCard(
      this.opponentDeck,
      this.stats,
      this.isPlayerTurn,
      this.opponentEnergy,
    );

    if (!aiCard) {
      console.log("AI has no affordable cards!");
      // Skip AI turn
      this.time.delayedCall(1000, () => this.revealBothCards(null));
      return;
    }

    // Deduct AI energy cost
    const energyCost = aiCard.energyCost || 0;
    this.opponentEnergy -= energyCost;
    this.updateEnergyDisplay();

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
    // Flip animation for player's card
    if (this.playerStagedCard && this.playerStagedCardBack) {
      this.tweens.add({
        targets: [this.playerStagedCard, this.playerStagedCardBack],
        scaleX: 0,
        duration: 200,
        ease: "Power2",
        onComplete: () => {
          // Destroy face-down placeholders after flip
          if (this.playerStagedCard) this.playerStagedCard.destroy();
          if (this.playerStagedCardBack) this.playerStagedCardBack.destroy();

          // Create revealed player card
          this.createRevealedPlayerCard();

          // Flip in animation for revealed card
          this.revealedPlayerCardObjects.forEach((obj) => {
            obj.setScale(0, 1);
            this.tweens.add({
              targets: obj,
              scaleX: 1,
              duration: 200,
              ease: "Power2",
            });
          });
        },
      });
    }

    // Flip animation for opponent's card
    if (this.opponentStagedCard && this.opponentStagedCardBack) {
      this.tweens.add({
        targets: [this.opponentStagedCard, this.opponentStagedCardBack],
        scaleX: 0,
        duration: 200,
        ease: "Power2",
        onComplete: () => {
          // Destroy face-down placeholders after flip
          if (this.opponentStagedCard) this.opponentStagedCard.destroy();
          if (this.opponentStagedCardBack)
            this.opponentStagedCardBack.destroy();

          // Create revealed opponent card
          this.createRevealedOpponentCard(aiCard);

          // Flip in animation for revealed card
          this.revealedOpponentCardObjects.forEach((obj) => {
            obj.setScale(0, 1);
            this.tweens.add({
              targets: obj,
              scaleX: 1,
              duration: 200,
              ease: "Power2",
            });
          });
        },
      });
    }

    // Apply card effects after flip animations complete
    this.time.delayedCall(500, () => {
      const playerCard = this.selectedCard ? this.selectedCard.card : null;
      // Highlight which card resolves first
      this.highlightFasterCard(playerCard, aiCard);
      // Then apply effects after highlight is shown
      this.time.delayedCall(800, () => {
        this.applyBothCardEffects(playerCard, aiCard);
      });
    });
  }

  highlightFasterCard(playerCard, aiCard) {
    // Use GameLogic to determine which card resolves first
    const resolutionOrder = GameLogic.determineResolutionOrder(
      playerCard,
      aiCard,
    );

    if (resolutionOrder === "player") {
      this.addPriorityHighlight(true);
    } else if (resolutionOrder === "ai") {
      this.addPriorityHighlight(false);
    }
    // If 'none', don't highlight anything
  }

  addPriorityHighlight(isPlayer) {
    const targetY = isPlayer ? 600 : 310;
    const targetObjects = isPlayer
      ? this.revealedPlayerCardObjects
      : this.revealedOpponentCardObjects;

    // Add multiple glow layers for a stronger effect
    // Outer glow
    const outerGlow = this.add
      .rectangle(375, targetY, 170, 230, 0xffd700, 0.4)
      .setOrigin(0.5)
      .setDepth(99);
    targetObjects.push(outerGlow);

    // Middle glow
    const middleGlow = this.add
      .rectangle(375, targetY, 160, 220, 0xffd700, 0.5)
      .setOrigin(0.5)
      .setDepth(99);
    targetObjects.push(middleGlow);

    // Inner glow
    const innerGlow = this.add
      .rectangle(375, targetY, 150, 210, 0xffff00, 0.3)
      .setOrigin(0.5)
      .setDepth(99);
    targetObjects.push(innerGlow);

    // Add pulsing animation to all glow layers
    this.tweens.add({
      targets: [outerGlow, middleGlow, innerGlow],
      alpha: 0.8,
      duration: 400,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });

    // Add "RESOLVES FIRST" text above/below the card
    const textY = isPlayer ? targetY - 120 : targetY + 120;
    const priorityText = this.add
      .text(375, textY, "⚡ RESOLVES FIRST ⚡", {
        fontSize: "16px",
        color: "#ffd700",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(102);
    targetObjects.push(priorityText);

    // Pulse the text
    this.tweens.add({
      targets: priorityText,
      scale: 1.1,
      duration: 400,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });
  }

  createRevealedPlayerCard() {
    // Clear any previously revealed cards
    this.revealedPlayerCardObjects.forEach((obj) => obj.destroy());
    this.revealedPlayerCardObjects = [];

    // Check if player passed (no selectedCard means player passed)
    const playerPassed = !this.selectedCard;

    // Show player's card or PASS indicator
    if (playerPassed) {
      const playerPassBg = this.add
        .rectangle(375, 600, 140, 200, 0x333333)
        .setOrigin(0.5)
        .setStrokeStyle(3, 0x888888)
        .setDepth(100);
      this.revealedPlayerCardObjects.push(playerPassBg);

      const playerPassText = this.add
        .text(375, 600, "PASS", {
          fontSize: "24px",
          color: "#888888",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setDepth(101);
      this.revealedPlayerCardObjects.push(playerPassText);
    } else {
      // Show actual player card (full card design)
      const playerCardBg = this.add
        .rectangle(375, 600, 140, 200, 0x2a2a2a)
        .setOrigin(0.5)
        .setDepth(100);
      this.revealedPlayerCardObjects.push(playerCardBg);

      const playerCardBorder = this.add
        .rectangle(375, 600, 140, 200)
        .setOrigin(0.5)
        .setStrokeStyle(3, 0x00aaff)
        .setDepth(100);
      this.revealedPlayerCardObjects.push(playerCardBorder);

      const playerCardName = this.add
        .text(375, 530, this.selectedCard.card.name, {
          fontSize: "14px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: 130 },
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setDepth(101);
      this.revealedPlayerCardObjects.push(playerCardName);

      const playerCardDesc = this.add
        .text(375, 590, this.selectedCard.card.description, {
          fontSize: "10px",
          color: "#cccccc",
          align: "center",
          wordWrap: { width: 130 },
        })
        .setOrigin(0.5)
        .setDepth(101);
      this.revealedPlayerCardObjects.push(playerCardDesc);
    }
  }

  createRevealedOpponentCard(aiCard) {
    // Clear any previously revealed cards
    this.revealedOpponentCardObjects.forEach((obj) => obj.destroy());
    this.revealedOpponentCardObjects = [];

    // Show AI's card or PASS indicator
    if (!aiCard) {
      const aiPassBg = this.add
        .rectangle(375, 310, 140, 200, 0x333333)
        .setOrigin(0.5)
        .setStrokeStyle(3, 0x888888)
        .setDepth(100);
      this.revealedOpponentCardObjects.push(aiPassBg);

      const aiPassText = this.add
        .text(375, 310, "PASS", {
          fontSize: "24px",
          color: "#888888",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setDepth(101);
      this.revealedOpponentCardObjects.push(aiPassText);
    } else {
      // Show actual AI card (full card design)
      const aiCardBg = this.add
        .rectangle(375, 310, 140, 200, 0x2a2a2a)
        .setOrigin(0.5)
        .setDepth(100);
      this.revealedOpponentCardObjects.push(aiCardBg);

      const aiCardBorder = this.add
        .rectangle(375, 310, 140, 200)
        .setOrigin(0.5)
        .setStrokeStyle(3, 0xff4444)
        .setDepth(100);
      this.revealedOpponentCardObjects.push(aiCardBorder);

      const aiCardName = this.add
        .text(375, 240, aiCard.name, {
          fontSize: "14px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: 130 },
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setDepth(101);
      this.revealedOpponentCardObjects.push(aiCardName);

      const aiCardDesc = this.add
        .text(375, 300, aiCard.description, {
          fontSize: "10px",
          color: "#cccccc",
          align: "center",
          wordWrap: { width: 130 },
        })
        .setOrigin(0.5)
        .setDepth(101);
      this.revealedOpponentCardObjects.push(aiCardDesc);
    }
  }

  async applyBothCardEffects(playerCard, aiCard) {
    // Use CardResolver with delay for sequential resolution
    await CardResolver.resolveCardsWithDelay(
      playerCard,
      aiCard,
      this.playerStats,
      this.opponentStats,
      this,
    );

    // Check win/loss
    if (this.checkGameOver()) {
      return;
    }

    // Finalize turn
    this.finalizeTurn();
  }

  showCancellationEffect(isPlayerCancelled) {
    const targetY = isPlayerCancelled ? 600 : 310;
    const targetObjects = isPlayerCancelled
      ? this.revealedPlayerCardObjects
      : this.revealedOpponentCardObjects;

    // Add red X overlay
    const cancelX = this.add
      .text(375, targetY, "✖", {
        fontSize: "120px",
        color: "#ff0000",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(103)
      .setAlpha(0);
    targetObjects.push(cancelX);

    // Fade in and pulse the X
    this.tweens.add({
      targets: cancelX,
      alpha: 1,
      scale: 1.2,
      duration: 300,
      yoyo: true,
      repeat: 1,
      ease: "Power2",
    });

    // Add "CANCELLED!" text
    const textY = isPlayerCancelled ? targetY + 130 : targetY - 130;
    const cancelText = this.add
      .text(375, textY, "CANCELLED!", {
        fontSize: "20px",
        color: "#ff0000",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(103)
      .setAlpha(0);
    targetObjects.push(cancelText);

    this.tweens.add({
      targets: cancelText,
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });
  }

  finalizeTurn() {
    // Check win/loss
    if (this.checkGameOver()) {
      return;
    }

    // Reset for next turn
    this.selectedCard = null;
    this.isSelectingCard = false;
    this.turnInProgress = false;
    this.turnNumber++;

    // Increment energy (+5 per turn, max 20)
    this.playerEnergy = Math.min(this.playerEnergy + 5, this.maxEnergy);
    this.opponentEnergy = Math.min(this.opponentEnergy + 5, this.maxEnergy);
    this.updateEnergyDisplay();

    // Draw new card (max 4 cards)
    // const newCard = drawCards(this.playerDeck, 1)[0];
    // if (newCard && this.hand.length < 4) {
    //   this.hand.push(newCard);
    //   this.cardHand.setCards(this.hand);
    //   this.cardHand.render();
    // }

    const newCards = drawCards(this.playerDeck, 2);
    newCards.forEach((card) => {
      if (card && this.hand.length < 3) {
        this.hand.push(card);
      }
    });

    this.cardHand.setCards(this.hand);
    this.cardHand.render();

    // Update deck counter
    this.updateDeckCounter();

    // Update PASS button visibility
    this.updatePassButtonVisibility();
  }

  endPlayerTurn() {
    //switch turn to AI
    this.isPlayerTurn = false;

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

    // Log stat changes if requested (removed battle log display)

    // Update visual bars
    this.updateStatBars();
  }

  getStatLabel(statKey) {
    const labels = {
      investigation: "Investigation",
      morale: "Morale",
      publicOpinion: "Public Opinion",
      pressure: "Pressure",
    };
    return labels[statKey] || statKey;
  }

  updateStatBars() {
    // Use the StatBarGroup's animated update method
    Object.keys(this.playerStats).forEach((statKey) => {
      const newValue = this.playerStats[statKey];
      const oldValue =
        this.playerStatGroup.bars[statKey]?.bar?.getData("currentValue");

      if (this.playerStatGroup.bars[statKey]) {
        this.playerStatGroup.bars[statKey].bar.setData(
          "currentValue",
          newValue,
        );
        this.playerStatGroup.updateStat(statKey, newValue, oldValue);
      }
    });

    Object.keys(this.opponentStats).forEach((statKey) => {
      const newValue = this.opponentStats[statKey];
      const oldValue =
        this.opponentStatGroup.bars[statKey]?.bar?.getData("currentValue");

      if (this.opponentStatGroup.bars[statKey]) {
        this.opponentStatGroup.bars[statKey].bar.setData(
          "currentValue",
          newValue,
        );
        this.opponentStatGroup.updateStat(statKey, newValue, oldValue);
      }
    });

    // Update legacy stats reference
    this.stats = this.playerStats;
  }

  endAITurn() {
    console.log("--- AI turn ended ---");
    this.turnNumber++;
    this.isPlayerTurn = true;
    this.turnInProgress = false;

    console.log(`=== Turn ${this.turnNumber} - Player's turn ===`);

    // Update PASS button visibility for new player turn
    this.updatePassButtonVisibility();
  }

  aiTurn() {
    console.log("AI turn...");

    // AI draws 3 random cards to choose from
    const aiCards = drawCards(this.opponentDeck, 3);
    if (aiCards.length === 0) return;

    // Update deck counter after AI draws
    this.updateDeckCounter();

    // Choose the best card based on AI logic
    const bestCard = this.chooseBestAICard(aiCards);
    console.log("AI plays:", bestCard.name);

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
