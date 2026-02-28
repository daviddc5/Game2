import Phaser from "phaser";
import { getCharacter } from "../data/characters.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    this.winner = data.winner; // "player" or "opponent"
    this.playerCharacter = data.playerCharacter;
    this.opponentCharacter = data.opponentCharacter;
    this.reason = data.reason || "Game Over";
    this.scoring = data.scoring || null;
    this.finalStats = data.finalStats || null;
  }

  create() {
    const centerX = this.cameras.main.width / 2;

    // Semi-transparent overlay
    this.add
      .rectangle(centerX, 667, 750, 1334, 0x000000, 0.9)
      .setOrigin(0.5);

    const didPlayerWin = this.winner === "player";
    const winnerName = didPlayerWin
      ? this.playerCharacter
      : this.opponentCharacter;

    // === YOU WIN / YOU LOSE ===
    const outcomeText = didPlayerWin ? "YOU WIN!" : "YOU LOSE!";
    const outcomeColor = didPlayerWin ? "#00ff00" : "#ff0000";

    this.add
      .text(centerX, 100, outcomeText, {
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
      .text(centerX, 180, `${winnerName} Wins`, {
        fontFamily: "DeathNote",
        fontSize: "44px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // === REASON ===
    let reasonText = this.reason;
    if (this.reason.includes("reached 100")) {
      const statMatch = this.reason.match(/(\w+) reached 100/);
      if (statMatch) {
        const statName =
          statMatch[1].charAt(0).toUpperCase() + statMatch[1].slice(1);
        reasonText = `${statName} reached 100!`;
      }
    }

    this.add
      .text(centerX, 255, reasonText, {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#ffd700",
        align: "center",
        wordWrap: { width: 680 },
        lineSpacing: 6,
      })
      .setOrigin(0.5);

    // === STAT BREAKDOWN ===
    let yPos = 310;

    if (this.finalStats) {
      const playerChar = getCharacter(this.playerCharacter);
      const opponentChar = getCharacter(this.opponentCharacter);

      yPos = this.drawStatComparison(
        yPos,
        "YOUR STATS",
        playerChar,
        this.finalStats.yourStats,
        didPlayerWin
      );

      yPos += 12;

      yPos = this.drawStatComparison(
        yPos,
        "OPPONENT STATS",
        opponentChar,
        this.finalStats.opponentStats,
        !didPlayerWin
      );
    }

    // === SCORING SUMMARY (for out-of-cards) ===
    if (this.scoring && this.scoring.type === "outOfCards") {
      yPos += 8;
      yPos = this.drawScoringExplanation(yPos);
    }

    // === BUTTONS ===
    const buttonY = Math.max(yPos + 40, 1050);

    const playAgainButton = this.add
      .text(centerX, buttonY, "PLAY AGAIN", {
        fontFamily: "DeathNote",
        fontSize: "44px",
        color: "#ffffff",
        padding: { x: 50, y: 20 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playAgainButton.on("pointerover", () =>
      playAgainButton.setBackgroundColor("#00aaff")
    );
    playAgainButton.on("pointerout", () =>
      playAgainButton.setBackgroundColor("transparent")
    );
    playAgainButton.on("pointerdown", () => this.scene.start("MenuScene"));

    const exitButton = this.add
      .text(centerX, buttonY + 70, "MAIN MENU", {
        fontFamily: "DeathNote",
        fontSize: "40px",
        color: "#ffffff",
        padding: { x: 50, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    exitButton.on("pointerover", () =>
      exitButton.setBackgroundColor("#ff0000")
    );
    exitButton.on("pointerout", () =>
      exitButton.setBackgroundColor("transparent")
    );
    exitButton.on("pointerdown", () => this.scene.start("TitleScene"));
  }

  drawStatComparison(startY, header, charData, stats, isWinner) {
    const centerX = this.cameras.main.width / 2;
    const headerColor = isWinner ? "#00ff00" : "#ff4444";
    const displayName = charData ? charData.displayName : "Unknown";

    // Header
    this.add
      .text(centerX, startY, `── ${header} (${displayName}) ──`, {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: headerColor,
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    let y = startY + 30;
    const statOrder = ["investigation", "morale", "publicOpinion", "pressure"];

    for (const stat of statOrder) {
      if (stats[stat] === undefined) continue;

      const label = charData ? charData.statLabels[stat] : stat;
      const isGreen = charData ? charData.statColors[stat].isGreen : false;
      const color = isGreen ? "#44ff44" : "#ff6666";
      const value = stats[stat];

      // Stat bar background
      this.add.rectangle(centerX, y, 500, 22, 0x222222).setOrigin(0.5);

      // Stat bar fill
      const barWidth = Math.min(value / 100, 1) * 498;
      const barColor = isGreen ? 0x44ff44 : 0xff4444;
      if (barWidth > 0) {
        this.add
          .rectangle(
            centerX - 249 + barWidth / 2,
            y,
            barWidth,
            20,
            barColor,
            0.6
          )
          .setOrigin(0.5);
      }

      // Label + value (on top of bar)
      this.add
        .text(centerX - 245, y, label, {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          color: color,
        })
        .setOrigin(0, 0.5);

      this.add
        .text(centerX + 245, y, `${value}`, {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          color: color,
          fontStyle: "bold",
        })
        .setOrigin(1, 0.5);

      y += 28;
    }

    return y;
  }

  drawScoringExplanation(startY) {
    const centerX = this.cameras.main.width / 2;
    const scoring = this.scoring;

    // Which scoring data is "you" vs "opponent"
    let yourData, oppData;
    if (scoring.p1.character === this.playerCharacter) {
      yourData = scoring.p1;
      oppData = scoring.p2;
    } else {
      yourData = scoring.p2;
      oppData = scoring.p1;
    }

    this.add
      .text(centerX, startY, "── HOW SCORING WORKS ──", {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffd700",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    let y = startY + 28;

    this.add
      .text(centerX, y, "Score = Green Stats - Red Stats", {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#cccccc",
        fontStyle: "italic",
      })
      .setOrigin(0.5);
    y += 28;

    // Your score line
    const yourGreen = yourData.breakdown.green
      .reduce((s, g) => s + g.value, 0);
    const yourRed = yourData.breakdown.red
      .reduce((s, r) => s + r.value, 0);

    this.add
      .text(
        centerX,
        y,
        `You: ${yourGreen} green - ${yourRed} red = ${yourData.score}`,
        {
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
          color: yourData.score >= oppData.score ? "#44ff44" : "#ff6666",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);
    y += 26;

    // Opponent score line
    const oppGreen = oppData.breakdown.green
      .reduce((s, g) => s + g.value, 0);
    const oppRed = oppData.breakdown.red
      .reduce((s, r) => s + r.value, 0);

    this.add
      .text(
        centerX,
        y,
        `Opponent: ${oppGreen} green - ${oppRed} red = ${oppData.score}`,
        {
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
          color: oppData.score >= yourData.score ? "#44ff44" : "#ff6666",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    return y + 20;
  }
}
