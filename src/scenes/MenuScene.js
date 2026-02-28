import Phaser from "phaser";
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const centerX = this.cameras.main.width / 2;

    // Title
    this.add
      .text(centerX, 200, "SHADOWS OF\nJUDGMENT", {
        fontFamily: "DeathNote",
        fontSize: "72px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Multiplayer button
    const multiplayerButton = this.add
      .text(centerX, 450, "🌐 MULTIPLAYER", {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffffff",
        padding: { x: 60, y: 20 },
        backgroundColor: "#0066cc",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Single Player button
    const singlePlayerButton = this.add
      .text(centerX, 580, "🎮 SINGLE PLAYER", {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffffff",
        padding: { x: 60, y: 20 },
        backgroundColor: "#006600",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // How to Play button
    const howToPlayButton = this.add
      .text(centerX, 750, "❓ HOW TO PLAY", {
        fontFamily: "DeathNote",
        fontSize: "36px",
        color: "#aaaaaa",
        padding: { x: 40, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Multiplayer hover
    multiplayerButton.on("pointerover", () =>
      multiplayerButton.setBackgroundColor("#0088ff")
    );
    multiplayerButton.on("pointerout", () =>
      multiplayerButton.setBackgroundColor("#0066cc")
    );
    multiplayerButton.on("pointerdown", () => {
      this.scene.start("MultiplayerLobbyScene");
    });

    // Single Player hover
    singlePlayerButton.on("pointerover", () =>
      singlePlayerButton.setBackgroundColor("#009900")
    );
    singlePlayerButton.on("pointerout", () =>
      singlePlayerButton.setBackgroundColor("#006600")
    );
    singlePlayerButton.on("pointerdown", () => {
      this.scene.start("SinglePlayerLobbyScene");
    });

    // How to Play hover
    howToPlayButton.on("pointerover", () =>
      howToPlayButton.setColor("#ffffff")
    );
    howToPlayButton.on("pointerout", () =>
      howToPlayButton.setColor("#aaaaaa")
    );
    howToPlayButton.on("pointerdown", () => {
      this.scene.start("InstructionsScene");
    });
  }
}
