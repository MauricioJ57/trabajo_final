export default class gameplay extends Phaser.Scene {
  constructor() {
    super("gameplay");
  }

  init() {
  }

  preload() {
    this.load.image("bala normal", "public/assets/bala normal(renovada).png");
    this.load.image("bala electrica", "public/assets/bala electrica.png");
    this.load.image("boceto nave inical", "public/assets/boceto nave 1.png");
    this.load.image("revenator", "public/assets/revenator.png");
  }

  create() {
    this.add.image(400, 300, "bala normal");
    this.add.image(400, 400, "bala electrica");
    this.add.image(400, 600, "revenator");

    this.player = this.physics.add.sprite(400, 300, "boceto nave inical");

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(250);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-250);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(250);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.restart.isDown)
      this.scene.restart("laberintojuego")
        
  }

}