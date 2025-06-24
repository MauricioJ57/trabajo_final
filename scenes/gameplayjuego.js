export default class gameplay extends Phaser.Scene {
  constructor() {
    super("gameplay");
  }

  init() {
    this.score = 0;
    this.timer = 120;
  }

  preload() {
    this.load.image("bala normal", "public/assets/bala normal(renovada).png");
    this.load.image("bala_electrica", "public/assets/bala electrica.png");
    this.load.image("boceto nave inical", "public/assets/boceto nave 1.png");
    this.load.image("revenator", "public/assets/revenator.png");
    this.load.image("navedash", "public/assets/boceto nave dash 2.png");
    this.load.image("bala", "public/assets/bala normal(renovada).png");
    this.load.image("bala_naranja", "public/assets/bala naranja.png");
    this.load.image("bala_verde", "public/assets/bala verde.png");
    this.load.image("bala_negra", "public/assets/bala negra.png");
    this.load.image("bala_veloz", "public/assets/bala veloz.png");
    this.load.image("fondo", "public/assets/wallpaperbetter.jpg");
    this.load.image("jefe_grande", "public/assets/jefe extra grande.png");
    this.load.image("escudo", "public/assets/escudo.png");
    this.load.image("corazones", "public/assets/corazones.png");
    this.load.image(
      "laser_grande",
      "public/assets/ataque laser(parte de sprite).png"
    );
    this.load.image(
      "rayo_pequeño",
      "public/assets/rayo rojo(parte de sprite).png"
    );
  }

  create() {
    this.add.image(400, 300, "fondo");

    this.jefe = this.physics.add.sprite(100, 100, "jefe_grande");

    this.tweens.add({
      targets: this.jefe,
      x: 600,
      ease: "Linear",
      duration: 5000,
      repeat: -1,
      yoyo: true,
      loop: true,
    });

    this.scoretext = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.timertext = this.add.text(16, 50, "Time: ", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.timeleft = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.timer > 0) {
          this.timer--;
          this.timertext.setText(`Time: ${this.timer}`);
        }
        if (this.timer === 0) {
          this.timeleft.remove();
          this.spawnBulletsup.remove();
          this.input.off("pointerdown");
          this.lostgame = this.add.text(400, 300, "Game Over", {
            fontSize: "64px",
            fill: "#ff0000",
          });
          this.lostgame.setOrigin(0.5, 0.5);
          this.physics.pause();
        }
      },
      loop: true,
    });

    if (this.timer <= 0) {
      this.cambioOleada = this.oleada.addEvent({
        delay: 5000,
        callback: () => {
          this.spawnBulletsup.remove();
          this.timeleft.remove();
          console.log("se activo la oleada");
        },
      });
    }

    this.oleadatext = this.add.text(16, 100, "Oleada: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.bala = "bala normal";

    this.bulletsplayer = "bala normal";

    this.bala_electrica = "bala electrica";

    this.bullets = this.physics.add.group();

    this.spawnBulletsup = this.time.addEvent({
      delay: 100,
      callback: () => {
        const balas = {
          bala: { value: 5 },
          bala_electrica: { value: 10 },
          bala_naranja: { value: 15 },
          bala_verde: { value: 20 },
          bala_negra: { value: 25 },
          bala_veloz: { value: 30 },
        };

        const balaKeys = Object.keys(balas);
        const balaSeleccionada = Phaser.Math.RND.pick(balaKeys);
        const shape = this.bullets.create(
          Phaser.Math.Between(32, 900),
          0,
          balaSeleccionada
        );
        shape.setData("value", balas[balaSeleccionada].value);
        shape.setScale(1);
        shape.setVelocityY(100);
        shape.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        if (this.timer <= 0) {
          shape.setVelocityY(+200);
          console.log("se actualizo la velocidad");
        }
      },
      loop: true,
    });

    this.player = this.physics.add.sprite(400, 300, "navedash");
    this.player.setCollideWorldBounds(true);

    this.bulletsplayer = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const angle = this.player.rotation - Phaser.Math.DegToRad(90);

      const offset = 40;
      const bulletX = this.player.x + Math.cos(angle) * offset;
      const bulletY = this.player.y + Math.sin(angle) * offset;

      const bullet_player = this.bulletsplayer.create(bulletX, bulletY, "bala");

      const bulletSpeed = 300;
      bullet_player.setVelocity(
        Math.cos(angle) * bulletSpeed,
        Math.sin(angle) * bulletSpeed
      );
      bullet_player.setRotation(this.player.rotation);
    }); // funcion para disparar balas

    this.physics.add.collider(this.player, this.bullets, (player, bullet) => {
      this.lostgame = this.add.text(400, 300, "Game Over", {
        fontSize: "64px",
        fill: "#ff0000",
      });
      this.lostgame.setOrigin(0.5, 0.5);
      this.physics.pause();
      this.timeleft.remove();
      this.spawnBulletsup.remove();
      this.input.keyboard.off("keydown-SPACE");
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );
    this.bombKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.physics.add.overlap(
      this.bulletsplayer,
      this.bullets,
      (playerBullet, enemyBullet) => {
        const value = enemyBullet.getData("value") || 0;
        this.score += value;
        this.scoretext.setText("Score: " + this.score);
        playerBullet.destroy();
        enemyBullet.destroy();
      }
    ); // funcion para destruir las balas del jugador y enemigas al chocar

    /*this.input.on('pointermove', (pointer) => {
      this.pointerX = pointer.worldX;
      this.pointerY = pointer.worldY;
    }); // funcion para mover al jugador con el mouse

    this.pointerX = this.player.x;
    this.pointerY = this.player.y;*/
  }

  update() {
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-250);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(250);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(250);
    } else {
      this.player.setVelocityX(0);
    }

    /*const speed = 250;
    const distanciax = this.pointerX - this.player.x;
    const distanciay = this.pointerY - this.player.y;
    const distance = Math.sqrt(distanciax * distanciax + distanciay * distanciay);
    if (distance > 40) {
      const angle = Math.atan2(distanciay, distanciax);
      this.player.setVelocityX(Math.cos(angle) * speed);
      this.player.setVelocityY(Math.sin(angle) * speed);
      this.player.setRotation(angle + Phaser.Math.DegToRad(90));
    } else {
      this.player.setVelocity(0, 0);
    }*/
    if (this.restartKey.isDown) {
      this.scene.restart();
    }
  }
}
