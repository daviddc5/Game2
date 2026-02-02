import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  // Pass data when starting this scene: this.scene.start("GameOverScene", { winner: "Detective L", playerCharacter: "Kira", reason: "Investigation reached 100!" })
  init(data) {
    this.winner = data.winner;
    this.playerCharacter = data.playerCharacter;
    this.reason = data.reason || "Game Over";
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Semi-transparent overlay
    this.add
      .rectangle(centerX, centerY, 750, 1334, 0x000000, 0.8)
      .setOrigin(0.5);

    // Winner text
    const winnerText =
      this.winner === this.playerCharacter ? "YOU WIN!" : "YOU LOSE!";
    const textColor =
      this.winner === this.playerCharacter ? "#00ff00" : "#ff0000";

    this.add
      .text(centerX, centerY - 150, winnerText, {
        fontFamily: "DeathNote",
        fontSize: "72px",
        color: textColor,
        align: "center",
      })
      .setOrigin(0.5);

    // Winner name
    this.add
      .text(centerX, centerY - 50, `${this.winner} WINS`, {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Reason for win/loss
    this.add
      .text(centerX, centerY + 50, this.reason, {
        fontFamily: "Arial, sans-serif",
        fontSize: "28px",
        color: "#ffd700",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    // Play Again button
    const button = this.add
      .rectangle(centerX, centerY + 150, 400, 100, 0x333333)
      .setInteractive({ useHandCursor: true });

    const buttonText = this.add
      .text(centerX, centerY + 150, "Play Again", {
        fontFamily: "Arial, sans-serif",
        fontSize: "40px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0x555555);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x333333);
    });

    button.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}
