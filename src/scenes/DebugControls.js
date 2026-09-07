import Phaser from "phaser";
import GameLogic from "../logic/GameLogic.js";

export function createDebugControls(scene) {
  scene.debugButton = scene.add
    .text(70, 40, "DEBUG", {
      fontFamily: "DeathNote",
      fontSize: "26px",
      color: "#ffffff",
      backgroundColor: "#8a4b00",
      padding: { x: 14, y: 8 },
    })
    .setOrigin(0.5)
    .setDepth(170)
    .setInteractive({ useHandCursor: true });

  scene.debugButton.on("pointerover", () => {
    scene.debugButton.setBackgroundColor("#b36000");
  });
  scene.debugButton.on("pointerout", () => {
    scene.debugButton.setBackgroundColor("#8a4b00");
  });
  scene.debugButton.on("pointerdown", () => toggleDebugPanel(scene));

  const panelObjects = [];
  const panelBg = scene.add
    .rectangle(375, 667, 680, 760, 0x111111, 0.96)
    .setDepth(3500)
    .setStrokeStyle(3, 0xaa7700)
    .setVisible(false);
  panelObjects.push(panelBg);

  const panelTitle = scene.add
    .text(375, 330, "TEST MODE", {
      fontFamily: "DeathNote",
      fontSize: "52px",
      color: "#ffcc66",
    })
    .setOrigin(0.5)
    .setDepth(3501)
    .setVisible(false);
  panelObjects.push(panelTitle);

  const panelHint = scene.add
    .text(375, 380, "Set instant stat values for quick win/lose checks", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#dddddd",
    })
    .setOrigin(0.5)
    .setDepth(3501)
    .setVisible(false);
  panelObjects.push(panelHint);

  const statRows = ["investigation", "morale", "publicOpinion", "pressure"];
  statRows.forEach((stat, index) => {
    const y = 460 + index * 95;
    const label = scene.add
      .text(375, y, scene.playerCharacter.statLabels[stat], {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(3501)
      .setVisible(false);
    panelObjects.push(label);

    panelObjects.push(
      ...createDebugPanelButton(
        scene,
        225,
        y,
        "YOU = 100",
        "#007a2f",
        () => setDebugStat(scene, "player", stat, 100),
      ),
      ...createDebugPanelButton(
        scene,
        525,
        y,
        "FOE = 100",
        "#8f1f1f",
        () => setDebugStat(scene, "opponent", stat, 100),
      ),
    );
  });

  panelObjects.push(
    ...createDebugPanelButton(
      scene,
      250,
      870,
      "RESET BOTH",
      "#555555",
      () => resetDebugStats(scene),
      210,
      48,
    ),
    ...createDebugPanelButton(
      scene,
      500,
      870,
      "CLOSE",
      "#4444aa",
      () => toggleDebugPanel(scene, false),
      170,
      48,
    ),
  );

  scene.debugPanelObjects = panelObjects;
  scene.debugPanelVisible = false;
}

function createDebugPanelButton(
  scene,
  x,
  y,
  text,
  color,
  onClick,
  width = 180,
  height = 42,
) {
  const bg = scene.add
    .rectangle(
      x,
      y,
      width,
      height,
      Phaser.Display.Color.HexStringToColor(color).color,
    )
    .setDepth(3501)
    .setInteractive({ useHandCursor: true })
    .setVisible(false);

  const label = scene.add
    .text(x, y, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(3502)
    .setVisible(false);

  bg.on("pointerdown", onClick);
  bg.on("pointerover", () => bg.setAlpha(0.85));
  bg.on("pointerout", () => bg.setAlpha(1));

  return [bg, label];
}

function toggleDebugPanel(scene, forceState) {
  const nextState =
    typeof forceState === "boolean" ? forceState : !scene.debugPanelVisible;
  scene.debugPanelVisible = nextState;
  if (!scene.debugPanelObjects) return;
  scene.debugPanelObjects.forEach((object) => object.setVisible(nextState));
}

function setDebugStat(scene, target, stat, value) {
  const clamped = GameLogic.clampStat(value);
  if (target === "player") {
    scene.playerStats[stat] = clamped;
  } else {
    scene.opponentStats[stat] = clamped;
  }

  scene.updateStatBars();
  scene.checkGameOver();
}

function resetDebugStats(scene) {
  Object.keys(scene.playerStats).forEach((stat) => {
    scene.playerStats[stat] = 0;
    scene.opponentStats[stat] = 0;
  });
  scene.updateStatBars();
}
