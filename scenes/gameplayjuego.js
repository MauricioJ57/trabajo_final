export default class gameplay extends Phaser.Scene {
  constructor() {
    super("gameplay");
  }

  init() {
    this.score = 0;
    this.timer = 10;
    this.oleada = 1;
    this.tiempoTotal = 0; // tiempo total de supervivencia
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
    this.load.image("fondo", "public/assets/fondo de gameplay (mejorado).jpg");
    this.load.image('jefe_grande', "public/assets/jefe extra grande.png");
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
    this.load.image('pausa', "public/assets/pausa.png");
    this.load.image('tiempoboton', "public/assets/boton de tiempo.png");
    this.load.image('oleadaboton', "public/assets/boton de oleada.png")
    this.load.image('hudscore', "public/assets/hud de score.png");
    this.load.image('nave escudo', "public/assets/nave escudo.png")
  }

  create() {
    this.add.image(400, 300, "fondo");

    this.add.image(0, 12, 'tiempoboton').setOrigin(0, 0).setDepth(1000);

    this.add.image(0, 45, 'oleadaboton').setOrigin(0, 0).setDepth(1000);

    this.add.image(250, 0, 'hudscore').setOrigin(0, 0).setDepth(1000);

    // --- Jefe y patrón de balas del jefe ---
    this.boss = null;
    this.bossActive = false;
    this.bossBullets = this.physics.add.group();
    this.circlebullets = null;

    // Función para activar el jefe y su patrón de balas
    this.activateBoss = () => {
      if (this.bossActive) return;
      this.bossActive = true;
      this.boss = this.physics.add.sprite(620, 100, 'jefe_grande');
      this.boss.setData('vida', 10000);
      this.boss.setCollideWorldBounds(true);
      this.boss.setVelocityX(50);
      this.boss.setBounce(1, 0);
      this.boss.setDepth(10);
      this.bossBullets.clear(true, true);
      this.circlebullets = this.time.addEvent({
        delay: 1500,
        callback: () => {
          const numBalas = 30;
          const radio = 1;
          for (let i = 0; i < numBalas; i++) {
            const angulo = Phaser.Math.DegToRad((360 / numBalas) * i);
            const bullet = this.bossBullets.create(this.boss.x, this.boss.y, 'bala');
            const velocidad = 200;
            bullet.setVelocity(Math.cos(angulo) * velocidad * radio, Math.sin(angulo) * velocidad * radio);
            bullet.setRotation(angulo + Phaser.Math.DegToRad(90));
          }
        },
        loop: true
      });
    }; // sistema de jefe

    // Función para desactivar el jefe y su patrón de balas
    this.deactivateBoss = () => {
      if (!this.bossActive) return;
      this.bossActive = false;
      if (this.boss) {
        this.boss.destroy();
        this.boss = null;
      }
      if (this.circlebullets) {
        this.circlebullets.remove();
        this.circlebullets = null;
      }
      this.bossBullets.clear(true, true);
    };

    // Comprobar si se debe activar el jefe al iniciar
    if (this.oleada % 5 === 0 && this.oleada >= 5) {
      this.activateBoss();
    }

    this.scoretext = this.add.text(350, 16, "Score: 0", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "arial",
    }).setOrigin(0.5, 0);
    this.scoretext.setDepth(1000); //le da prioridad al texto o imagen

    this.timertext = this.add.text(16, 16, `${this.timer}`, {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "arial",
    });
    this.timertext.setDepth(1000);

    this.oleadatext = this.add.text(16, 50, 'Oleada: ' + this.oleada, {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "arial",
    });
    this.oleadatext.setDepth(1000);

    this.vidasText = this.add.text(16, 150, 'Vidas: 3', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'arial',
    });
    this.vidasText.setDepth(1000);

    this.timeleft = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.tiempoTotal++;
        if (this.timer > 0) {
          this.timer--;
          this.timertext.setText(`${this.timer}`);
        }
        if (this.timer === 0 && !this.enOleada) {
          // Fin de oleada: sumar 1, pausar balas, esperar 6 segundos y reiniciar
          this.enOleada = true;
          this.oleada++;
          this.oleadatext.setText('Oleada: ' + this.oleada);
          this.spawnBulletsup.paused = true;
          if (this.circlebullets) this.circlebullets.paused = true;
          if (this.spawnPatternCircle) this.spawnPatternCircle.paused = true;
          if (this.spawnPatternCircleRight) this.spawnPatternCircleRight.paused = true;
          this.timertext.setText('Oleada terminada');
          this.time.delayedCall(6000, () => {
            this.timer = 10;
            this.timertext.setText(`${this.timer}`);
            this.spawnBulletsup.paused = false;
            if (this.circlebullets) this.circlebullets.paused = false;
            if (this.spawnPatternCircle) this.spawnPatternCircle.paused = false;
            if (this.spawnPatternCircleRight) this.spawnPatternCircleRight.paused = false;
            // Activar o desactivar jefe según la oleada
            if (this.oleada % 5 === 0 && this.oleada >= 5) {
              this.activateBoss();
            } else {
              this.deactivateBoss();
            }
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

        let weightedBalaKeys;
        if (this.oleada < 2) {
          weightedBalaKeys = ['bala', 'bala'];
        } else if (this.oleada < 4) {
          weightedBalaKeys = ['bala', 'bala', 'bala_electrica'];
        } else if (this.oleada < 6) {
          weightedBalaKeys = ['bala', 'bala', 'bala_electrica', 'bala_veloz'];
        } else if (this.oleada < 8) {
          weightedBalaKeys = ['bala', 'bala', 'bala_electrica', 'bala_veloz', 'bala_verde'];
        } else if (this.oleada < 11) {
          weightedBalaKeys = ['bala', 'bala', 'bala_electrica', 'bala_veloz', 'bala_verde', 'bala_naranja'];
        } else {
          weightedBalaKeys = ['bala', 'bala', 'bala_electrica', 'bala_veloz', 'bala_verde', 'bala_naranja', 'bala_negra'];
        } //añade prioridad a las balas segun la oleada superada
        const balaSeleccionada = Phaser.Math.RND.pick(weightedBalaKeys);
        const lado = Phaser.Math.Between(0, 2);
        let x, y, velX = 0, velY = 0;
        const velocidadBalaBase = 100 + (this.oleada - 1) * 15;
        let velocidadBala = velocidadBalaBase;
        if (balaSeleccionada === 'bala_veloz') {
          velocidadBala += 100;
        }
        if (lado === 0) { 
          x = Phaser.Math.Between(32, 900);
          y = 0;
          velY = velocidadBala;
        } else if (lado === 1) { 
          x = 0;
          y = Phaser.Math.Between(32, 600);
          velX = velocidadBala;
        } else if (lado === 2) { 
          x = 900;
          y = Phaser.Math.Between(32, 600);
          velX = -velocidadBala;
        }
        const shape = this.bullets.create(x, y, balaSeleccionada);
        shape.setData("value", balas[balaSeleccionada].value);
        shape.setScale(1);
        shape.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        if (balaSeleccionada === 'bala_negra') {
          shape.setData('esNegra', true);
        } else {
          shape.setVelocity(velX, velY);
        }
      },
      loop: true,
    }); //funcion para generar balas aleatorias

    this.player = this.physics.add.sprite(400, 300, 'nave escudo');
    this.player.setCollideWorldBounds(true);
    this.player.setData('vida', 3);
    // informacion de player

    // Mostrar vidas en pantalla
    this.vidasText = this.add.text(16, 150, 'Vidas: 3', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'arial',
    });
    this.vidasText.setDepth(1000);

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
      let vidas = player.getData('vida');
      vidas--;
      player.setData('vida', vidas);
      this.vidasText.setText('Vidas: ' + vidas);
      bullet.destroy();
      if (vidas <= 0) {
        this.scene.start('perdiojuego', {
          score: this.score,
          tiempoTotal: this.tiempoTotal,
          oleada: this.oleada
        });
        return;
      }
    }); // colision entre jugador y balas con condicion de perdida

    // Colisión entre el jugador y las balas del jefe
    this.physics.add.collider(this.player, this.bossBullets, (player, bossBullet) => {
      let vidas = player.getData('vida');
      vidas--;
      player.setData('vida', vidas);
      this.vidasText.setText('Vidas: ' + vidas);
      bossBullet.destroy();
      if (vidas <= 0) {
        this.scene.start('perdiojuego', {
          score: this.score,
          tiempoTotal: this.tiempoTotal,
          oleada: this.oleada
        });
        return;
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );// controles

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
    ); //colision ente balas de jugador y enemigas

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
    ); //colision entre balas de jugador y enemigas

    const pausabutton = this.add.image(650, 45, 'pausa');
    pausabutton.setSize(36, 36);
    pausabutton.setInteractive();
    pausabutton.on('pointerover', () => {
      pausabutton.setTint(0xfdd700);
    });
    pausabutton.on('pointerout', () => {
      pausabutton.clearTint(); 
    });
    pausabutton.depth = 1;
    //boton de pausa

    pausabutton.once('pointerup', () => {
      this.scene.pause();
      const pausaText = this.add.text(250, 300, "PAUSA", {
        fontSize: "64px",
        fill: "#fff",
        fontFamily: "arial",
      }).setOrigin(0, 0);
      pausaText.setDepth(2000);
    }); //texto de pausa

    // --- PATRONES DE BALAS ---

    // 1. Balas con patrón circular (desde el centro arriba)
    this.spawnPatternCircle = this.time.addEvent({
      delay: 1800,
      callback: () => {
        const centroX = Phaser.Math.Between(200, 600);
        const centroY = 0;
        const numBalas = 12;
        const velocidad = 150 + (this.oleada - 1) * 10;
        for (let i = 0; i < numBalas; i++) {
          const angulo = Phaser.Math.DegToRad((360 / numBalas) * i);
          const bullet = this.bullets.create(centroX, centroY, 'bala');
          bullet.setVelocity(Math.cos(angulo) * velocidad, Math.sin(angulo) * velocidad);
          bullet.setRotation(angulo + Phaser.Math.DegToRad(90));
        }
      },
      loop: true,
    });
    // 2. balas con patron circular (derecha)
    this.spawnPatternCircleRight = this.time.addEvent({
      delay: 1800,
      callback: () => {
        const centroX = 0;
        const centroY = Phaser.Math.Between(0, 300);
        const numBalas = 12;
        const velocidad = 150 + (this.oleada - 1) * 10;
        for (let i = 0; i < numBalas; i++) {
          const angulo = Phaser.Math.DegToRad((360 / numBalas) * i);
          const bullet = this.bullets.create(centroX, centroY, 'bala');
          bullet.setVelocity(Math.cos(angulo) * velocidad, Math.sin(angulo) * velocidad);
          bullet.setRotation(angulo + Phaser.Math.DegToRad(90));
        }
      },
      loop: true,
    });

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
    } //controles de movimiento

    if (this.restartKey.isDown) {
      this.scene.restart();
    } // boton de reinicio

    // Hacer que las balas negras sigan al jugador
    this.bullets.getChildren().forEach(bullet => {
      if (bullet.getData('esNegra')) {
        const dx = this.player.x - bullet.x;
        const dy = this.player.y - bullet.y;
        const angle = Math.atan2(dy, dx);
        const velocidadBalaBase = 100 + (this.oleada - 1) * 15;
        let velocidadBala = velocidadBalaBase;
        // Si quieres que la bala negra sea más rápida, puedes sumar aquí
        bullet.setVelocity(Math.cos(angle) * velocidadBala, Math.sin(angle) * velocidadBala);
        bullet.setRotation(angle + Phaser.Math.DegToRad(90));
      }
    });
  }
}
