export default class StatsModal {
  constructor(scene) {
    this.scene = scene;
    this.modalObjects = [];
    this.isVisible = false;
  }

  show(target, character, stats) {
    // Don't open if already visible
    if (this.isVisible) return;

    const isPlayer = target === "player";
    const portraitKey =
      character.name === "Independent Detective"
        ? "detective-neutral"
        : "killer-neutral";
    const themeColor = isPlayer ? 0x00aaff : 0xff4444;
    const themeColorHex = isPlayer ? "#00aaff" : "#ff4444";

    // Dark overlay background
    const overlay = this.scene.add
      .rectangle(375, 667, 750, 1334, 0x000000, 0.9)
      .setOrigin(0.5)
      .setDepth(3000)
      .setInteractive(); // Block clicks behind
    this.modalObjects.push(overlay);

    // Close on tap outside (on overlay)
    overlay.on("pointerdown", () => {
      this.close();
    });

    // Modal container background
    const modalBg = this.scene.add
      .rectangle(375, 500, 600, 900, 0x1a1a1a)
      .setOrigin(0.5)
      .setDepth(3001);
    this.modalObjects.push(modalBg);

    const modalBorder = this.scene.add
      .rectangle(375, 500, 600, 900)
      .setOrigin(0.5)
      .setStrokeStyle(4, themeColor)
      .setDepth(3001);
    this.modalObjects.push(modalBorder);

    // Enlarged portrait
    const portrait = this.scene.add.image(375, 200, portraitKey);
    portrait.setScale(0.4);
    if (isPlayer) portrait.setFlipX(true);
    portrait.setDepth(3002);
    this.modalObjects.push(portrait);

    // Character name
    const nameText = this.scene.add
      .text(375, 350, character.displayName, {
        fontSize: "32px",
        color: themeColorHex,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(3002);
    this.modalObjects.push(nameText);

    // Stats title
    const statsTitle = this.scene.add
      .text(375, 420, "STATS", {
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(3002);
    this.modalObjects.push(statsTitle);

    // Display all 4 stats with bars using character-specific labels and colors
    // Sort stats: green (positive) first, then red (negative)
    const statKeys = ["investigation", "morale", "publicOpinion", "pressure"];
    const sortedStats = statKeys.sort((a, b) => {
      const aIsGreen = character.statColors[a].isGreen;
      const bIsGreen = character.statColors[b].isGreen;
      // Green stats (true) come before red stats (false)
      if (aIsGreen && !bIsGreen) return -1;
      if (!aIsGreen && bIsGreen) return 1;
      return 0;
    });

    let yOffset = 480;
    sortedStats.forEach((statKey) => {
      const value = stats[statKey];
      const label = character.statLabels[statKey];
      const colorInfo = character.statColors[statKey];

      // Stat label and value
      const statText = this.scene.add
        .text(150, yOffset, `${label}:`, {
          fontSize: "18px",
          color: "#ffffff",
        })
        .setOrigin(0, 0.5)
        .setDepth(3002);
      this.modalObjects.push(statText);

      const valueText = this.scene.add
        .text(600, yOffset, `${value}/100`, {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(1, 0.5)
        .setDepth(3002);
      this.modalObjects.push(valueText);

      // Stat bar background
      const barBg = this.scene.add
        .rectangle(375, yOffset + 25, 450, 20, 0x333333)
        .setOrigin(0.5)
        .setDepth(3002);
      this.modalObjects.push(barBg);

      // Stat bar fill
      const barWidth = (value / 100) * 450;
      const barFill = this.scene.add
        .rectangle(150, yOffset + 25, barWidth, 20, colorInfo.color)
        .setOrigin(0, 0.5)
        .setDepth(3003);
      this.modalObjects.push(barFill);

      yOffset += 80;
    });

    // Close button
    const closeButton = this.scene.add
      .circle(650, 100, 30, 0xff4444)
      .setDepth(3004)
      .setInteractive({ useHandCursor: true });
    this.modalObjects.push(closeButton);

    const closeX = this.scene.add
      .text(650, 100, "✕", {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(3005);
    this.modalObjects.push(closeX);

    closeButton.on("pointerdown", () => {
      this.close();
    });

    // Hover effect on close button
    closeButton.on("pointerover", () => {
      closeButton.setFillStyle(0xff6666);
    });
    closeButton.on("pointerout", () => {
      closeButton.setFillStyle(0xff4444);
    });

    this.isVisible = true;
  }

  close() {
    if (this.modalObjects.length > 0) {
      this.modalObjects.forEach((obj) => obj.destroy());
      this.modalObjects = [];
    }
    this.isVisible = false;
  }

  destroy() {
    this.close();
  }
}
