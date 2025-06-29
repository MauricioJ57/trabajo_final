export default class gameplay extends Phaser.Scene {
  constructor() {
    super("gameplay");
  }

  init() {
    this.score = 0;
    this.timer = 10;
    this.oleada = 1;
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

    this.oleadatext = this.add.text(16, 100, 'Oleada: ' + this.oleada, {
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
        if (this.timer === 0 && !this.enOleada) {
          // Fin de oleada: sumar 1, pausar balas, esperar 6 segundos y reiniciar
          this.enOleada = true;
          this.oleada++;
          this.oleadatext.setText('Oleada: ' + this.oleada);
          this.spawnBulletsup.paused = true;
          this.timertext.setText('Oleada terminada');
          this.time.delayedCall(6000, () => {
            this.timer = 10;
            this.timertext.setText(`Time: ${this.timer}`);
            
            this.spawnBulletsup.paused = false;
            this.enOleada = false;
          });
        }
        if (this.timer === 0 && this.enOleada) {
          // Evitar que se repita el proceso
          return;
        }
      },
      loop: true,
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
        // La velocidad base es 100, y se suma 50 por cada oleada
        const velocidadBala = 100 + (this.oleada - 1) * 15;
        console.log("Velocidad de la bala:", velocidadBala);
        shape.setVelocityY(velocidadBala);
        shape.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      },
      loop: true,
    });

    this.player = this.physics.add.sprite(400, 300, "navedash");
    this.player.setCollideWorldBounds(true);

    this.bulletsplayer = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp = this.bulletsplayer.create(this.player.x + 20, this.player.y - 20, 'bala');
      bulletp.setVelocityY(-300);
    }); // funcion para disparar balas

    this.bulletsplayer2 = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp2 = this.bulletsplayer2.create(this.player.x - 20, this.player.y - 20, 'bala');
      bulletp2.setVelocityY(-300);
    }); // funcion para disparar balas

    this.bulletsplayer3 = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp3 = this.bulletsplayer3.create(this.player.x, this.player.y - 20, 'bala');
      bulletp3.setVelocityY(-300);
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

    this.physics.add.overlap(
      this.bulletsplayer2,
      this.bullets,
      (playerBullet, enemyBullet) => {
        const value = enemyBullet.getData("value") || 0;
        this.score += value;
        this.scoretext.setText("Score: " + this.score);
        playerBullet.destroy();
        enemyBullet.destroy();
      }
    );

    this.physics.add.overlap(
      this.bulletsplayer3,
      this.bullets,
      (playerBullet, enemyBullet) => {
        const value = enemyBullet.getData("value") || 0;
        this.score += value;
        this.scoretext.setText("Score: " + this.score);
        playerBullet.destroy();
        enemyBullet.destroy();
      }
    );

    /*const graphics = this.make.graphics().fillStyle(0x00ff00).fillRect(0, 0, 800, 100);

    graphics.generateTexture('hudbar', 800, 100);

    graphics.destroy();

    this.add.image(400, 300, 'hudbar');*/
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

    if (this.restartKey.isDown) {
      this.scene.restart();
    }
  }
}
