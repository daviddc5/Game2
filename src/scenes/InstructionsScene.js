import Phaser from "phaser";

export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: "InstructionsScene" });
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;

    this.pages = this.buildPages();
    this.currentPage = 0;

    // Background
    this.add.rectangle(cx, H / 2, W, H, 0x0a0a0a).setOrigin(0.5);

    // Page content container (destroyed / recreated on page change)
    this.pageContainer = this.add.container(0, 0);

    // Navigation
    this.prevBtn = this.add
      .text(80, H - 80, "◀ PREV", {
        fontFamily: "DeathNote",
        fontSize: "36px",
        color: "#888888",
        padding: { x: 15, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.changePage(-1));

    this.nextBtn = this.add
      .text(W - 80, H - 80, "NEXT ▶", {
        fontFamily: "DeathNote",
        fontSize: "36px",
        color: "#00aaff",
        padding: { x: 15, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.changePage(1));

    this.pageIndicator = this.add
      .text(cx, H - 80, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#666666",
      })
      .setOrigin(0.5);

    // Back button (top left)
    this.add
      .text(20, 20, "✕ BACK", {
        fontFamily: "DeathNote",
        fontSize: "32px",
        color: "#ff4444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene"));

    this.showPage(0);
  }

  buildPages() {
    return [
      // PAGE 1: Overview
      {
        title: "SHADOWS OF JUDGMENT",
        subtitle: "How to Play",
        sections: [
          {
            heading: "THE GAME",
            body: "A strategic card battle between a Detective trying to uncover the truth and a Vigilante seeking public support.\n\nBoth players play cards simultaneously each turn. Cards affect stats for both you and your opponent.",
          },
          {
            heading: "GOAL",
            body: "Win by maxing both GREEN stats to 100.\nLose if any RED stat reaches 100.",
          },
          {
            heading: "TURNS",
            body: "1. Both players pick a card\n2. Cards are revealed simultaneously\n3. Stats are updated\n4. Draw new cards\n5. Repeat!",
          },
        ],
      },
      // PAGE 2: Characters & Stats
      {
        title: "CHARACTERS",
        subtitle: "Each character has 4 stats",
        sections: [
          {
            heading: "🔍 DETECTIVE",
            body: "GREEN stats (win condition):\n  • Evidence Chain\n  • Task Force Unity\n\nRED stats (lose condition):\n  • Public Panic\n  • Case Doubt\n\nYou win when both green stats hit 100. You lose if either red stat hits 100.",
            color: "#44aaff",
          },
          {
            heading: "⚖️ VIGILANTE",
            body: "GREEN stats (win condition):\n  • Cult Resolve\n  • Public Support\n\nRED stats (lose condition):\n  • Evidence Against\n  • Manhunt Heat\n\nYou win when both green stats hit 100. You lose if either red stat hits 100.",
            color: "#ff4444",
          },
        ],
      },
      // PAGE 3: Win & Lose Conditions
      {
        title: "WIN CONDITIONS",
        subtitle: "Three ways the game ends",
        sections: [
          {
            heading: "🏆 STAT VICTORY",
            body: "You win when both of your GREEN stats reach 100.",
            color: "#00ff00",
          },
          {
            heading: "💀 STAT DEFEAT",
            body: "You lose when any of your RED stats reaches 100.",
            color: "#ff4444",
          },
          {
            heading: "🃏 OUT OF CARDS",
            body: "When both players run out of cards, a final score is calculated:\n\nScore = Green Stats − Red Stats\n\nHigher score wins! If tied, the player with higher combined GREEN progress takes it.",
            color: "#ffd700",
          },
        ],
      },
      // PAGE 4: Cards & Energy
      {
        title: "CARDS & ENERGY",
        subtitle: "Playing your hand",
        sections: [
          {
            heading: "🎴 CARDS",
            body: "Each card has:\n  • Energy cost — shown on the card\n  • Self effects — changes to YOUR stats\n  • Opponent effects — changes to THEIR stats\n\nGreen numbers help you, red numbers hurt.",
          },
          {
            heading: "⚡ ENERGY",
            body: "You start with limited energy and gain +5 each turn. If you can't afford a card, you must pass.\n\nCheaper cards are weaker but let you save energy for powerful plays later!",
          },
          {
            heading: "🛡️ COUNTER CARDS",
            body: "Some cards are COUNTER type — they cancel the opponent's card effects if played on the same turn!",
            color: "#ff8800",
          },
        ],
      },
      // PAGE 5: Tips
      {
        title: "TIPS & STRATEGY",
        subtitle: "Play smarter",
        sections: [
          {
            heading: "📊 WATCH BOTH SIDES",
            body: "Tap VIEW to see both your stats and your opponent's. Know when they're close to winning — or losing!",
          },
          {
            heading: "🎯 BALANCE OFFENSE & DEFENSE",
            body: "Don't just push your green win path. Some cards raise the opponent's red danger stats to threaten defeat.",
          },
          {
            heading: "🃏 MANAGE YOUR DECK",
            body: "You draw 2 cards per turn (max 4 in hand). If the game goes to scoring, every stat matters — green helps, red hurts.",
          },
          {
            heading: "⚡ ENERGY TIMING",
            body: "Sometimes it's better to play a cheap card now and save energy for a big play next turn.",
          },
        ],
      },
    ];
  }

  showPage(index) {
    this.currentPage = index;
    const page = this.pages[index];
    const cx = this.cameras.main.width / 2;

    // Clear previous page content
    this.pageContainer.removeAll(true);

    let y = 120;

    // Title
    const title = this.add
      .text(cx, y, page.title, {
        fontFamily: "DeathNote",
        fontSize: "52px",
        color: "#ffffff",
        align: "center",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    this.pageContainer.add(title);
    y += 60;

    // Subtitle
    if (page.subtitle) {
      const sub = this.add
        .text(cx, y, page.subtitle, {
          fontFamily: "Arial, sans-serif",
          fontSize: "22px",
          color: "#aaaaaa",
          fontStyle: "italic",
          align: "center",
        })
        .setOrigin(0.5);
      this.pageContainer.add(sub);
      y += 40;
    }

    // Divider
    const divider = this.add.rectangle(cx, y, 600, 2, 0x333333).setOrigin(0.5);
    this.pageContainer.add(divider);
    y += 20;

    // Sections
    for (const section of page.sections) {
      const headingColor = section.color || "#ffd700";

      const heading = this.add
        .text(cx, y, section.heading, {
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          color: headingColor,
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5);
      this.pageContainer.add(heading);
      y += 30;

      const body = this.add
        .text(cx, y, section.body, {
          fontFamily: "Arial, sans-serif",
          fontSize: "20px",
          color: "#cccccc",
          align: "left",
          wordWrap: { width: 620 },
          lineSpacing: 4,
        })
        .setOrigin(0.5, 0);
      this.pageContainer.add(body);
      y += body.height + 25;
    }

    // Update navigation
    this.prevBtn.setVisible(index > 0);
    this.nextBtn.setText(index < this.pages.length - 1 ? "NEXT ▶" : "DONE ▶");
    this.nextBtn.setColor(
      index < this.pages.length - 1 ? "#00aaff" : "#00ff00",
    );

    // If on last page, DONE goes back to menu
    this.nextBtn.removeAllListeners("pointerdown");
    if (index < this.pages.length - 1) {
      this.nextBtn.on("pointerdown", () => this.changePage(1));
    } else {
      this.nextBtn.on("pointerdown", () => this.scene.start("MenuScene"));
    }

    // Page indicator dots
    const dots = this.pages.map((_, i) => (i === index ? "●" : "○")).join("  ");
    this.pageIndicator.setText(dots);
  }

  changePage(direction) {
    const next = this.currentPage + direction;
    if (next >= 0 && next < this.pages.length) {
      this.showPage(next);
    }
  }
}
