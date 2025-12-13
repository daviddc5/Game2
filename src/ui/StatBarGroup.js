/**
 * StatBarGroup - Manages a group of stat bars for a character
 */
export default class StatBarGroup {
  constructor(scene, x, y, stats, isPlayer) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.stats = stats;
    this.isPlayer = isPlayer;
    this.bars = {};
    this.texts = {};
  }

  create() {
    const spacing = 70;
    let currentY = this.y;

    this.stats.forEach((stat, index) => {
      this.createStatBar(currentY, stat);
      currentY += spacing;
    });
  }

  createStatBar(y, statConfig) {
    const { key, label, color, isPositive } = statConfig;
    const value = this.scene.stats[key];

    const barWidth = 300;
    const barHeight = 28;
    const labelWidth = 160;

    // Label with prefix
    const prefix = isPositive ? "+ " : "- ";
    const labelText = this.scene.add
      .text(this.x, y, prefix + label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: isPositive ? "#00ff00" : "#ff4444",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Container for bar and border
    const barY = y + 28;

    // Border (slightly larger than bar)
    this.scene.add
      .rectangle(this.x, barY, barWidth + 4, barHeight + 4, 0x666666)
      .setOrigin(0, 0.5);

    // Background bar (dark)
    this.scene.add
      .rectangle(this.x + 2, barY, barWidth, barHeight, 0x222222)
      .setOrigin(0, 0.5);

    // Foreground bar (colored, animated)
    const bar = this.scene.add
      .rectangle(this.x + 2, barY, (value / 100) * barWidth, barHeight, color)
      .setOrigin(0, 0.5);

    // Store reference
    this.bars[key] = {
      bar,
      color,
      x: this.x + 2,
      y: barY,
      maxWidth: barWidth,
    };

    // Value text (inside the bar, right aligned)
    const valueText = this.scene.add
      .text(this.x + barWidth - 10, barY, value, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0.5);

    this.texts[key] = valueText;
  }

  updateStat(key, newValue) {
    const barData = this.bars[key];
    if (!barData) return;

    // Animate bar width change
    this.scene.tweens.add({
      targets: barData.bar,
      width: (newValue / 100) * barData.maxWidth,
      duration: 300,
      ease: "Power2",
    });

    // Update text
    this.texts[key].setText(newValue);
  }

  getAllBars() {
    return this.bars;
  }

  getAllTexts() {
    return this.texts;
  }
}
