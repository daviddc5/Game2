const config = {
    //type is the rendering context
    type: Phaser.AUTO,
    //width and height of the game canvas
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: 0x1a1a1a,
    //sets the scenes to load
    scene: [BootScene, MenuScene, BattleScene, GameOverScene]
};

export default config;