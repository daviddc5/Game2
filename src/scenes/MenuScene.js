import Phaser from "phaser";
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }
  create() {
    // Get center of screen (works for any resolution)
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title text (mobile-sized, wrapped for narrow screens with Death Note font)
    this.add
      .text(centerX, 100, "SHADOWS OF\nJUDGMENT", {
        fontFamily: "DeathNote",
        fontSize: "36px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    //Choose Character text
    this.add
      .text(centerX, 220, "Choose Your Character", {
        fontFamily: "DeathNote",
        fontSize: "20px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    // L button (stacked vertically for mobile)
    const lButton = this.add
      .text(centerX, 320, "Detective L", {
        fontFamily: "DeathNote",
        fontSize: "28px",
        color: "#ffffff",
        padding: { x: 30, y: 15 },
        fixedWidth: 250,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Kira button (below L button for vertical layout)
    const kiraButton = this.add
      .text(centerX, 420, "Kira", {
        fontFamily: "DeathNote",
        fontSize: "28px",
        color: "#ffffff",
        padding: { x: 30, y: 15 },
        fixedWidth: 250,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Button hover effects - only on hover, blue for L, red for Kira
    lButton.on("pointerover", () => {
      lButton.setBackgroundColor("#00aaff");
    });
    lButton.on("pointerout", () => {
      lButton.setBackgroundColor("transparent");
    });
    lButton.on("pointerdown", () => this.startGame("L"));

    kiraButton.on("pointerover", () => {
      kiraButton.setBackgroundColor("#ff0000");
    });
    kiraButton.on("pointerout", () => {
      kiraButton.setBackgroundColor("transparent");
    });
    kiraButton.on("pointerdown", () => this.startGame("Kira"));
  }

  startGame(character) {
    //Store Character choice and start battle
    this.registry.set("playerCharacter", character);
    this.scene.start("BattleScene");
  }
}
