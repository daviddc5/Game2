import Phaser from "phaser";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  create() {
    const character = this.registry.get("playerCharacter");
    const centerX = this.cameras.main.width / 2;

    // Title showing who you're playing as
    this.add
      .text(centerX, 30, `Playing as: ${character}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
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

    // Create the stat bars
    this.createStatBars();
  }

  createStatBars() {
    // L's stats
    this.createStatBar(
      40,
      80,
      "+ Evidence",
      this.stats.evidence,
      0x4444ff,
      true
    );
    this.createStatBar(
      40,
      150,
      "- Public Pressure",
      this.stats.publicPressure,
      0xff4444,
      false
    );

    // Kira's stats
    this.createStatBar(
      40,
      250,
      "+ Justice Influence",
      this.stats.justiceInfluence,
      0x4444ff,
      true
    );
    this.createStatBar(
      40,
      320,
      "- Suspicion",
      this.stats.suspicion,
      0xff4444,
      false
    );
  }

  createStatBar(x, y, label, value, color, isPositive) {
    //Label for the Stat (with +/- prefix)
    this.add
      .text(x, y, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    // Background bar (dark gray)
    this.add.rectangle(x, y + 25, 250, 24, 0x333333).setOrigin(0, 0.5);

    // Foreground bar (colored, shows the value)
    const bar = this.add
      .rectangle(x, y + 25, (value / 100) * 250, 24, color)
      .setOrigin(0, 0.5);

    // Value text
    this.add
      .text(x + 260, y + 25, value, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);
  }
}
