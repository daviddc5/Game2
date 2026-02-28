import Phaser from "phaser";
import { getCharacter } from "../data/characters.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  // Pass data: { winner: "player" or "opponent", playerCharacter: "Independent Detective", opponentCharacter: "Vigilante", reason: "..." }
  init(data) {
    this.winner = data.winner; // "player" or "opponent"
    this.playerCharacter = data.playerCharacter;
    this.opponentCharacter = data.opponentCharacter;
    this.reason = data.reason || "Game Over";
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Semi-transparent overlay
    this.add
      .rectangle(centerX, centerY, 750, 1334, 0x000000, 0.9)
      .setOrigin(0.5);

    // Determine if player won
    const didPlayerWin = this.winner === "player";
    const winnerName = didPlayerWin ? this.playerCharacter : this.opponentCharacter;
    
    // YOU WIN / YOU LOSE text
    const outcomeText = didPlayerWin ? "YOU WIN!" : "YOU LOSE!";
    const outcomeColor = didPlayerWin ? "#00ff00" : "#ff0000";

    this.add
      .text(centerX, 200, outcomeText, {
        fontFamily: "DeathNote",
        fontSize: "80px",
        color: outcomeColor,
        align: "center",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    // Winner character name
    this.add
      .text(centerX, 320, `${winnerName} Wins`, {
        fontFamily: "DeathNote",
        fontSize: "48px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Parse and format the reason more clearly
    let formattedReason = this.reason;
    
    // Make "Higher investigation (51 vs 16)" more clear
    if (this.reason.includes("Higher")) {
      const match = this.reason.match(/Higher (\w+) \((\d+) vs (\d+)\)/);
      if (match) {
        const statName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        const winnerScore = match[2];
        const loserScore = match[3];
        formattedReason = `${winnerName} had more ${statName}\n(${winnerScore} vs ${loserScore})`;
      }
    }
    // Make "X reached 100!" more clear
    else if (this.reason.includes("reached 100")) {
      const statMatch = this.reason.match(/(\w+) reached 100/);
      if (statMatch) {
        const statName = statMatch[1].charAt(0).toUpperCase() + statMatch[1].slice(1);
        formattedReason = `${statName} reached 100!`;
      }
    }

    // Reason for win/loss
    this.add
      .text(centerX, 440, formattedReason, {
        fontFamily: "Arial, sans-serif",
        fontSize: "32px",
        color: "#ffd700",
        align: "center",
        wordWrap: { width: 650 },
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    // Try to load character portraits (use internal character names, not display names)
    const winnerChar = getCharacter(didPlayerWin ? this.playerCharacter : this.opponentCharacter);
    const loserChar = getCharacter(didPlayerWin ? this.opponentCharacter : this.playerCharacter);

    if (winnerChar) {
      // Winner portrait (larger, on left)
      const winnerPortrait = this.add.image(200, 650, winnerChar.portrait);
      if (winnerPortrait.texture.key !== "__MISSING") {
        winnerPortrait.setScale(0.8).setDepth(10);
        
        // Winner label
        this.add
          .text(200, 820, "WINNER", {
            fontFamily: "Arial, sans-serif",
            fontSize: "24px",
            color: "#00ff00",
            fontStyle: "bold",
          })
          .setOrigin(0.5);
      } else {
        winnerPortrait.destroy();
      }
    }

    if (loserChar) {
      // Loser portrait (smaller, on right, grayed out)
      const loserPortrait = this.add.image(550, 650, loserChar.portrait);
      if (loserPortrait.texture.key !== "__MISSING") {
        loserPortrait.setScale(0.6).setAlpha(0.5).setTint(0x666666).setDepth(10);
        
        // Loser label
        this.add
          .text(550, 780, "LOSER", {
            fontFamily: "Arial, sans-serif",
            fontSize: "20px",
            color: "#ff4444",
          })
          .setOrigin(0.5);
      } else {
        loserPortrait.destroy();
      }
    }

    // Play Again button (blue, DeathNote font)
    const playAgainButton = this.add
      .text(centerX, 950, "PLAY AGAIN", {
        fontFamily: "DeathNote",
        fontSize: "44px",
        color: "#ffffff",
        padding: { x: 50, y: 20 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playAgainButton.on("pointerover", () => {
      playAgainButton.setBackgroundColor("#00aaff");
    });

    playAgainButton.on("pointerout", () => {
      playAgainButton.setBackgroundColor("transparent");
    });

    playAgainButton.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });

    // Exit to Main Menu button (red, DeathNote font)
    const exitButton = this.add
      .text(centerX, 1060, "MAIN MENU", {
        fontFamily: "DeathNote",
        fontSize: "40px",
        color: "#ffffff",
        padding: { x: 50, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    exitButton.on("pointerover", () => {
      exitButton.setBackgroundColor("#ff0000");
    });

    exitButton.on("pointerout", () => {
      exitButton.setBackgroundColor("transparent");
    });

    exitButton.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}
