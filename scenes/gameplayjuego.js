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
    this.load.image("navedash", "public/assets/boceto nave dash 2.png");
  }

  create() {
    this.add.image(400, 300, "bala normal");
    this.add.image(400, 400, "bala electrica");
    this.add.image(400, 600, "revenator");
    this.add.image(300, 300, "navedash");

    this.player = this.physics.add.sprite(400, 300, "navedash");

    this.input.on('pointermove', (pointer) => {
      this.pointerX = pointer.worldX;
      this.pointerY = pointer.worldY;
    });

    this.pointerX = this.player.x;
    this.pointerY = this.player.y;
  }

  update() {
    const speed = 250;
    const distanciax = this.pointerX - this.player.x;
    const distanciay = this.pointerY - this.player.y;
    const distance = Math.sqrt(distanciax * distanciax + distanciay * distanciay);
    if (distance > 5) {
      const angle = Math.atan2(distanciay, distanciax);
      this.player.setVelocityX(Math.cos(angle) * speed);
      this.player.setVelocityY(Math.sin(angle) * speed);
      this.player.setRotation(angle + Phaser.Math.DegToRad(90));
    } else {
      this.player.setVelocity(0, 0);
    }

    if (this.keyR.isDown) {
      this.scene.restart();
    }
        
  }

}