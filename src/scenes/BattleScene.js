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
      .text(centerX, 60, `Playing as: ${character}`, {
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

    // Create the stat bars
    this.createStatBars();
  }

  createStatBars() {
    // L's stats
    this.createStatBar(
      80,
      160,
      "+ Evidence",
      this.stats.evidence,
      0x00ff00,
      true
    );
    this.createStatBar(
      80,
      300,
      "- Public Pressure",
      this.stats.publicPressure,
      0xff0000,
      false
    );

    // Kira's stats
    this.createStatBar(
      80,
      500,
      "+ Justice Influence",
      this.stats.justiceInfluence,
      0x00ff00,
      true
    );
    this.createStatBar(
      80,
      640,
      "- Suspicion",
      this.stats.suspicion,
      0xff0000,
      false
    );
  }

  createStatBar(x, y, label, value, color, isPositive) {
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

    // Foreground bar (white, Undertale style)
    const bar = this.add
      .rectangle(x, y + 50, (value / 100) * 500, 48, color)
      .setOrigin(0, 0.5);

    // Value text
    this.add
      .text(x + 520, y + 50, value, {
        fontFamily: "Arial, sans-serif",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);
  }
}
