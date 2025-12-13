import Phaser from "phaser";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  create() {
    const character = this.registry.get("playerCharacter");

    this.add
      .text(187.5, 333, `Battle as ${character}\n\n(Coming soon...)`, {
        fontFamily: "DeathNote",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
