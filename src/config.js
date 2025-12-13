import BootScene from "./scenes/BootScene.js";
import MenuScene from "./scenes/MenuScene.js";
import BattleScene from "./scenes/BattleScene.js";
// import GameOverScene from "./scenes/GameOverScene.js";

const config = {
  //type is the rendering context
  type: Phaser.AUTO,
  //mobile-first dimensions (iPhone 8 size)
  width: 375,
  height: 667,
  parent: "game-container",
  backgroundColor: 0x1a1a1a,
  //responsive scaling for all screen sizes
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  //sets the scenes to load
  scene: [BootScene, MenuScene, BattleScene],
};

export default config;
