import Phaser from "phaser";

//define the BootScene class that is the first scene to load

export default class BootScene extends Phaser.Scene {
  // Initialize the scene with a key
  constructor() {
    super({ key: "BootScene" });
  }

  //preload method to load assets
  preload() {
    //load Death Note font
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'DeathNote';
        src: url('assets/fonts/Death Note.ttf') format('truetype');
      }
    `;
    document.head.appendChild(style);

    // Load character portraits - Detective
    this.load.image(
      "detective-neutral",
      "assets/images/DetectivePortraits/detective-neutral.png"
    );
    this.load.image(
      "detective-winning",
      "assets/images/DetectivePortraits/detective-winning.png"
    );
    this.load.image(
      "detective-losing",
      "assets/images/DetectivePortraits/detective-losing.png"
    );

    // Load character portraits - Killer
    this.load.image(
      "killer-neutral",
      "assets/images/KillerPortraits/killer-neutral.png"
    );
    this.load.image(
      "killer-winning",
      "assets/images/KillerPortraits/killer-winning.png"
    );
    this.load.image(
      "killer-losing",
      "assets/images/KillerPortraits/killer-losing.png"
    );
  }

  create() {
    // Wait for font to load before starting TitleScene
    document.fonts.ready.then(() => {
      this.scene.start("TitleScene");
    });
  }
}
