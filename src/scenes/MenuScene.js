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
      .text(centerX, 200, "SHADOWS OF\nJUDGMENT", {
        fontFamily: "DeathNote",
        fontSize: "72px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    //Choose Character text
    this.add
      .text(centerX, 440, "Choose Your Character", {
        fontFamily: "DeathNote",
        fontSize: "40px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    // Detective button (stacked vertically for mobile)
    const detectiveButton = this.add
      .text(centerX, 640, "Independent Detective", {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffffff",
        padding: { x: 60, y: 30 },
        fixedWidth: 600,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Vigilante button (below Detective button for vertical layout)
    const vigilanteButton = this.add
      .text(centerX, 840, "Vigilante", {
        fontFamily: "DeathNote",
        fontSize: "56px",
        color: "#ffffff",
        padding: { x: 60, y: 30 },
        fixedWidth: 500,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Button hover effects - blue for Detective, red for Vigilante
    detectiveButton.on("pointerover", () => {
      detectiveButton.setBackgroundColor("#00aaff");
    });
    detectiveButton.on("pointerout", () => {
      detectiveButton.setBackgroundColor("transparent");
    });
    detectiveButton.on("pointerdown", () =>
      this.startGame("Independent Detective")
    );

    vigilanteButton.on("pointerover", () => {
      vigilanteButton.setBackgroundColor("#ff0000");
    });
    vigilanteButton.on("pointerout", () => {
      vigilanteButton.setBackgroundColor("transparent");
    });
    vigilanteButton.on("pointerdown", () => this.startGame("Vigilante"));
  }

  startGame(character) {
    //Store Character choice and start battle
    this.registry.set("playerCharacter", character);
    this.scene.start("BattleScene");
  }
}
