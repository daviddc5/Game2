import Phaser from "phaser";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  create() {
    const character = this.registry.get("playerCharacter");
    const centerX = this.cameras.main;

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
    // L's stats on the left
    //positive stats in green
    this.createStatBar(40, 100, "Evidence", this.stats.evidence, 0x00ff00);
    // this.createStatBar(40, 140, "Logic", 80, 0x00ff00);

    // negative stats in red
    this.createStatBar(
      40,
      180,
      "Public Pressure",
      this.stats.publicPressure,
      0xff0000
    );

    // Kira's stats on the right
    //positive stats in green
    this.createStatBar(
      40,
      280,
      "Justice Influence",
      this.stats.justiceInfluence,
      0x00ff00
    );

    // negative stats in red
    this.createStatBar(40, 360, "Suspicion", this.stats.suspicion, 0xff0000);
  }

  createStatBar(x, y, label, value, color) {
    //Label for the Stat
    this.add
      .text(text(x, y, label), {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "fffff",
      })
      .setOrigin(0, 0.5);

    // Background bar (dark gray)
    this.add.rectangle(x, y + 20, 200, 20, 0x333333).setOrigin(0, 0.5);

    // Foreground bar (colored, shows the value)
    const bar = this.add
      .rectangle(x, y + 20, (value / 100) * 200, 20, color)
      .setOrigin(0, 0.5);
    // Value text
    this.add
      .text(x + 210, y + 20, value, {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);
  }

  //Background bar (white)
}
