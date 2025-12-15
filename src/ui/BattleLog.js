export default class BattleLog {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.messages = [];
    this.maxMessages = 5;
    this.textObjects = [];
  }

  create() {
    // Create background
    this.background = this.scene.add.rectangle(
      this.x,
      this.y,
      this.width,
      this.height,
      0x1a1a1a,
      0.8
    );
    this.background.setStrokeStyle(2, 0x444444);

    // Create title
    this.titleText = this.scene.add
      .text(this.x, this.y - this.height / 2 + 20, "BATTLE LOG", {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#888888",
        align: "center",
      })
      .setOrigin(0.5);

    // Initialize text objects for messages
    for (let i = 0; i < this.maxMessages; i++) {
      const textObj = this.scene.add
        .text(
          this.x - this.width / 2 + 20,
          this.y - this.height / 2 + 50 + i * 30,
          "",
          {
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            color: "#ffffff",
            align: "left",
          }
        )
        .setOrigin(0, 0);
      this.textObjects.push(textObj);
    }
  }

  addMessage(message, color = "#ffffff") {
    this.messages.push({ text: message, color: color });

    // Keep only last N messages
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    this.render();
  }

  render() {
    // Update all text objects
    for (let i = 0; i < this.textObjects.length; i++) {
      if (i < this.messages.length) {
        const msg = this.messages[i];
        this.textObjects[i].setText(msg.text);
        this.textObjects[i].setColor(msg.color);
      } else {
        this.textObjects[i].setText("");
      }
    }
  }

  clear() {
    this.messages = [];
    this.render();
  }
}
