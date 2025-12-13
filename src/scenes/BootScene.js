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
  }

  create() {
    //start the MenuScene after loading is complete
    this.scene.start("MenuScene");
  }
  Í;
}
