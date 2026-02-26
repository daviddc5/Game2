import Phaser from "phaser";
import NetworkManager from "../network/NetworkManager.js";

export default class MultiplayerLobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: "MultiplayerLobbyScene" });
    this.selectedCharacter = null;
    this.isSearching = false;
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title
    this.add
      .text(centerX, 150, "MULTIPLAYER", {
        fontFamily: "DeathNote",
        fontSize: "72px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Connection status
    this.statusText = this.add
      .text(centerX, 250, "Connecting to server...", {
        fontFamily: "DeathNote",
        fontSize: "28px",
        color: "#ffaa00",
      })
      .setOrigin(0.5);

    // Character selection title
    this.add
      .text(centerX, 380, "Choose Your Character", {
        fontFamily: "DeathNote",
        fontSize: "40px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    // Detective button
    this.detectiveButton = this.add
      .text(centerX - 250, 540, "Independent\nDetective", {
        fontFamily: "DeathNote",
        fontSize: "40px",
        color: "#ffffff",
        padding: { x: 40, y: 25 },
        fixedWidth: 400,
        align: "center",
        backgroundColor: "#333333",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Vigilante button
    this.vigilanteButton = this.add
      .text(centerX + 250, 540, "Vigilante", {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffffff",
        padding: { x: 40, y: 25 },
        fixedWidth: 400,
        align: "center",
        backgroundColor: "#333333",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Find Match button (initially hidden)
    this.findMatchButton = this.add
      .text(centerX, 740, "FIND MATCH", {
        fontFamily: "DeathNote",
        fontSize: "56px",
        color: "#ffffff",
        padding: { x: 80, y: 30 },
        backgroundColor: "#00aa00",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    // Searching text (initially hidden)
    this.searchingText = this.add
      .text(centerX, 740, "SEARCHING FOR OPPONENT...", {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffaa00",
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Back button
    this.backButton = this.add
      .text(100, 80, "← BACK", {
        fontFamily: "DeathNote",
        fontSize: "36px",
        color: "#ffffff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0, 0.5)
      .setInteractive();

    this.setupButtons();
    this.connectToServer();
  }

  setupButtons() {
    // Detective button
    this.detectiveButton.on("pointerover", () => {
      if (!this.isSearching) {
        this.detectiveButton.setBackgroundColor("#00aaff");
      }
    });
    this.detectiveButton.on("pointerout", () => {
      if (this.selectedCharacter !== "Independent Detective") {
        this.detectiveButton.setBackgroundColor("#333333");
      }
    });
    this.detectiveButton.on("pointerdown", () => {
      if (!this.isSearching) {
        this.selectCharacter("Independent Detective");
      }
    });

    // Vigilante button
    this.vigilanteButton.on("pointerover", () => {
      if (!this.isSearching) {
        this.vigilanteButton.setBackgroundColor("#ff0000");
      }
    });
    this.vigilanteButton.on("pointerout", () => {
      if (this.selectedCharacter !== "Vigilante") {
        this.vigilanteButton.setBackgroundColor("#333333");
      }
    });
    this.vigilanteButton.on("pointerdown", () => {
      if (!this.isSearching) {
        this.selectCharacter("Vigilante");
      }
    });

    // Find Match button
    this.findMatchButton.on("pointerover", () => {
      this.findMatchButton.setBackgroundColor("#00dd00");
    });
    this.findMatchButton.on("pointerout", () => {
      this.findMatchButton.setBackgroundColor("#00aa00");
    });
    this.findMatchButton.on("pointerdown", () => {
      this.startMatchmaking();
    });

    // Back button
    this.backButton.on("pointerover", () => {
      this.backButton.setBackgroundColor("#333333");
    });
    this.backButton.on("pointerout", () => {
      this.backButton.setBackgroundColor("transparent");
    });
    this.backButton.on("pointerdown", () => {
      if (!this.isSearching) {
        NetworkManager.disconnect();
        this.scene.start("MenuScene");
      }
    });
  }

  connectToServer() {
    NetworkManager.connect();

    // Set up callbacks
    NetworkManager.onMatchFound = (data) => {
      console.log("Match found, starting battle...");
      this.isSearching = false;

      // Store game data in registry for BattleScene
      this.registry.set("isMultiplayer", true);
      this.registry.set("playerCharacter", this.selectedCharacter);
      this.registry.set("multiplayerData", data);

      // Start battle scene
      this.scene.start("BattleScene");
    };

    NetworkManager.onConnectionError = (error) => {
      this.statusText.setText("Connection failed! Check if server is running.");
      this.statusText.setColor("#ff0000");
    };

    // Wait a bit then check connection
    this.time.delayedCall(1000, () => {
      if (NetworkManager.connected) {
        this.statusText.setText("✅ Connected to server");
        this.statusText.setColor("#00ff00");
      } else {
        this.statusText.setText("❌ Connection failed - Is server running?");
        this.statusText.setColor("#ff0000");
      }
    });
  }

  selectCharacter(character) {
    this.selectedCharacter = character;

    // Reset both buttons
    this.detectiveButton.setBackgroundColor("#333333");
    this.vigilanteButton.setBackgroundColor("#333333");

    // Highlight selected
    if (character === "Independent Detective") {
      this.detectiveButton.setBackgroundColor("#0088cc");
    } else {
      this.vigilanteButton.setBackgroundColor("#cc0000");
    }

    // Show find match button
    this.findMatchButton.setVisible(true);
  }

  startMatchmaking() {
    if (!this.selectedCharacter || !NetworkManager.connected) {
      return;
    }

    this.isSearching = true;

    // Hide find match button, show searching text
    this.findMatchButton.setVisible(false);
    this.searchingText.setVisible(true);

    // Disable character buttons
    this.detectiveButton.disableInteractive();
    this.vigilanteButton.disableInteractive();

    // Start searching
    NetworkManager.findMatch(this.selectedCharacter);

    // Add pulsing animation to searching text
    this.tweens.add({
      targets: this.searchingText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  shutdown() {
    // Clean up event listeners when scene shuts down
    if (NetworkManager.onMatchFound) {
      NetworkManager.onMatchFound = null;
    }
    if (NetworkManager.onConnectionError) {
      NetworkManager.onConnectionError = null;
    }
  }
}
