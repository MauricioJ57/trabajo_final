export default class gameplay extends Phaser.Scene {
  constructor() {
    super("gameplay");
  }

  init() {
    this.score = 0;
  }

  preload() {
    this.load.image("bala normal", "public/assets/bala normal(renovada).png");
    this.load.image('bala_electrica', "public/assets/bala electrica.png");
    this.load.image("boceto nave inical", "public/assets/boceto nave 1.png");
    this.load.image("revenator", "public/assets/revenator.png");
    this.load.image("navedash", "public/assets/boceto nave dash 2.png");
    this.load.image('bala', "public/assets/bala normal(renovada).png");
    this.load.image('bala_naranja' , "public/assets/bala naranja.png");
    this.load.image('bala_verde', "public/assets/bala verde.png");
    this.load.image('bala_negra', "public/assets/bala negra.png");
    this.load.image('bala_veloz', "public/assets/bala veloz.png");
  }

  create() {
    this.add.image(400, 300, "bala normal");
    this.add.image(400, 400, "bala electrica");
    this.add.image(400, 600, "revenator");
    this.add.image(300, 300, "navedash");

    this.scoretext = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff'
    });

    this.timertext = this.add.text(16, 50, 'Time: 0', {
      fontSize: '32px',
      fill: '#fff'
    });

    this.oleadatext = this.add.text(16, 100, 'Oleada: 0', {
      fontSize: '32px',
      fill: '#fff'
    });

    this.bala = "bala normal";

    this.bulletsplayer = "bala normal";

    this.bala_electrica = "bala electrica";

    this.bullets = this.physics.add.group();

    this.spawnBulletsup = this.time.addEvent({
            delay: 100,
            callback: () => {
                const balas = {
                    bala: { value: 5},
                    bala_electrica: { value: 10},
                    bala_naranja: { value: 15},
                    bala_verde: { value: 20},
                    bala_negra: { value: 25},
                    bala_veloz: { value: 30}
                };

                const balaKeys = Object.keys(balas);
                const balaSeleccionada = Phaser.Math.RND.pick(balaKeys);
                const shape = this.bullets.create(Phaser.Math.Between(32, 900), 0, balaSeleccionada);
                shape.setData('value', balas[balaSeleccionada].value);
                shape.setScale(1);
                shape.setVelocityY(270)
                shape.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            },
            loop: true
      });

    this.player = this.physics.add.sprite(400, 300, "navedash");

    this.bulletsplayer = this.physics.add.group();
      this.input.on('pointerdown', () => {
        const bullet_player = this.bulletsplayer.create(this.player.x, this.player.y - 20, 'bala');
       bullet_player.setVelocityY(-300);
    }); // funcion para disparar balas
  
    this.physics.add.collider(this.player, this.bullets, (player, bullet) => {
      this.lostgame = this.add.text(400, 300, 'Game Over', {
        fontSize: '64px',
        fill: '#ff0000'
      })
      this.lostgame.setOrigin(0.5, 0.5);
      this.physics.pause();
      this.spawnBulletsup.remove();
      this.input.off('pointerdown');
    });

    this.physics.add.overlap(this.bulletsplayer, this.bullets, (playerBullet, enemyBullet) => {
      const value = enemyBullet.getData('value') || 0;
      this.score += value;
      this.scoretext.setText('Score: ' + this.score);
      playerBullet.destroy();
      enemyBullet.destroy();
    }); // funcion para destruir las balas del jugador y enemigas al chocar

    this.input.on('pointermove', (pointer) => {
      this.pointerX = pointer.worldX;
      this.pointerY = pointer.worldY;
    }); // funcion para mover al jugador con el mouse

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
    /*if (this.keyR.isDown) {
      this.scene.restart();
    }*/
        
  }

}