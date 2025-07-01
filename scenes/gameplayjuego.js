export default class gameplay extends Phaser.Scene {
  constructor() {
    super("gameplay");
  }

  init() {
    this.score = 0;
    this.timer = 60;
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
    this.load.image('nave escudo', "public/assets/nave escudo.png");
    this.load.image('bala del jugador', "public/assets/bala de jugador.png");
    this.load.image('boton de habilidad', "public/assets/boton de habilidad 3.png");

  }

  create(data) {
    this.add.image(400, 300, "fondo");

    this.add.image(0, 12, 'tiempoboton').setOrigin(0, 0).setDepth(1000);
    this.add.image(0, 45, 'oleadaboton').setOrigin(0, 0).setDepth(1000);
    this.add.image(250, 0, 'hudscore').setOrigin(0, 0).setDepth(1000);
    this.add.image(550, 550, 'boton de habilidad').setOrigin(0, 0).setDepth(1000).setAlpha(0.8);

    // --- Jefe y patrón de balas del jefe ---
    this.boss = null;
    this.bossActive = false;
    this.bossBullets = this.physics.add.group();
    this.circlebullets = null;

    // Sprite seleccionado recibido desde pantalla_seleccion
    this.spriteSeleccionado = (data && data.spriteSeleccionado) ? data.spriteSeleccionado : 'nave escudo';

    // Guardar la nave seleccionada
    this.naveSeleccionada = (data && data.naveSeleccionada) ? data.naveSeleccionada : 'ejemplo nave escudo';

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
            this.timer = 60;
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
        }
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
        // Apuntar el sprite según la dirección de la velocidad
        if (velX !== 0 || velY !== 0) {
          const angle = Math.atan2(velY, velX);
          shape.setRotation(angle + Phaser.Math.DegToRad(90));
        }
      },
      loop: true,
    }); //funcion para generar balas aleatorias

    this.player = this.physics.add.sprite(400, 300, this.naveSeleccionada);
    this.player.setCollideWorldBounds(true);
    this.player.setData('vida', 3);
    // informacion de player

    // Mostrar vidas en pantalla
    this.vidasText = this.add.text(16, 100, 'Vidas:', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'arial',
    });
    this.vidasText.setDepth(1000);

    this.bulletsplayer = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp = this.bulletsplayer.create(this.player.x + 20, this.player.y - 10, 'bala del jugador');
      bulletp.setVelocityY(-300);
    }); // funcion para disparar balas

    this.bulletsplayer2 = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp2 = this.bulletsplayer2.create(this.player.x - 20, this.player.y - 10, 'bala del jugador');
      bulletp2.setVelocityY(-300);
    }); // funcion para disparar balas

    this.bulletsplayer3 = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp3 = this.bulletsplayer3.create(this.player.x, this.player.y - 20, 'bala del jugador');
      bulletp3.setVelocityY(-300);
    }); // funcion para disparar balas

    this.bulletsplayer4 = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp4 = this.bulletsplayer4.create(this.player.x + 10, this.player.y - 15, 'bala del jugador');
      bulletp4.setVelocityY(-300);
    }); // funcion para disparar balas

    this.bulletsplayer5 = this.physics.add.group();
    this.input.keyboard.on("keydown-SPACE", () => {
      const bulletp5 = this.bulletsplayer5.create(this.player.x - 10, this.player.y - 15, 'bala del jugador');
      bulletp5.setVelocityY(-300);
    }); // funcion para disparar balas

    // Guardar el collider entre el jugador y las balas para poder activarlo/desactivarlo
    this.playerBulletsCollider = this.physics.add.collider(this.player, this.bullets, (player, bullet) => {
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
    this.laserKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );

    // Grupo para los sprites del láser
    this.laserSprites = [];
    this.laserActive = false;
    this.laserLength = 25; // cantidad de sprites que forman el rayo
    this.laserSpacing = 32; // separación entre sprites (ajustar según tamaño del sprite)
    this.laserCooldown = false; // para evitar reactivar el láser durante el efecto
    this.laserTimer = null;
    this.laserRechargeTimer = null;

    this.laserattack = this.physics.add.group()

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
    );
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
    ); //colision ente balas de jugador y enemigas

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

    // Texto de ayuda para controles de movimiento
    this.controlesMostrados = true;
    this.teclasPresionadas = { up: false, down: false, left: false, right: false };
    this.textoControles = this.add.text(220, 560, 'Mueve tu nave con las flechas', {
      fontSize: '15px',
      fill: '#fff',
      fontFamily: 'arial',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setDepth(2000);
    // Texto de ayuda para disparo (barra espaciadora)
    this.controlesBMostrados = true;
    this.teclasBPresionadas = { SPACE: false };
    this.textoControlesB = this.add.text(220, 600, 'presiona la barra espaciadora para disparar', {
      fontSize: '15px',
      fill: '#fff',
      fontFamily: 'arial',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setDepth(2000);

    // Botón de habilidad visual
    this.botonHabilidad = this.add.image(550, 550, 'boton de habilidad').setOrigin(0, 0).setDepth(1000).setAlpha(0.8);
    this.botonHabilidad.setTint(0xffffff); // Sin oscurecer al inicio
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

    // --- ATAQUE LÁSER CONTINUO (solo si nave seleccionada es 'ejemplo nave rayo grande') ---
    if (
      this.naveSeleccionada === 'ejemplo nave rayo grande' &&
      Phaser.Input.Keyboard.JustDown(this.laserKey) &&
      !this.laserActive &&
      !this.laserCooldown
    ) {
      this.laserActive = true;
      this.laserCooldown = true;
      if (this.botonHabilidad) this.botonHabilidad.setTint(0x444444); // Oscurecer botón
      // Crear sprites del láser
      for (let i = 0; i < this.laserLength; i++) {
        const laserY = this.player.y - 10 - i * this.laserSpacing;
        const laserSprite = this.physics.add.sprite(this.player.x, laserY, 'laser_grande');
        laserSprite.setOrigin(0.5, 1);
        laserSprite.setDepth(999);
        laserSprite.body.allowGravity = false;
        laserSprite.body.immovable = true;
        this.laserSprites.push(laserSprite);
      }
      // No crear escudo aquí
      // Activar colisión entre cada sprite del láser y las balas enemigas
      this.laserCollider = [];
      this.laserSprites.forEach(laserSprite => {
        const collider = this.physics.add.overlap(laserSprite, this.bullets, (laser, enemyBullet) => {
          const value = enemyBullet.getData("value") || 0;
          this.score += value;
          this.scoretext.setText("Score: " + this.score);
          enemyBullet.destroy();
        });
        this.laserCollider.push(collider);
      });
      // Temporizador para desactivar el láser después de 5 segundos
      this.laserTimer = this.time.delayedCall(5000, () => {
        this.laserActive = false;
        this.laserSprites.forEach(sprite => sprite.destroy());
        this.laserSprites = [];
        if (this.laserCollider) {
          this.laserCollider.forEach(collider => collider.destroy());
          this.laserCollider = null;
        }
        // Iniciar recarga de 5 segundos adicionales
        this.laserRechargeTimer = this.time.delayedCall(5000, () => {
          this.laserCooldown = false;
          if (this.botonHabilidad) this.botonHabilidad.setTint(0xffffff); // Restaurar color
        });
      });
    }
    // --- ESCUDO (solo si nave seleccionada es 'ejemplo nave escudo') ---
    if (
      this.naveSeleccionada === 'ejemplo nave escudo' &&
      Phaser.Input.Keyboard.JustDown(this.laserKey) &&
      !this.escudoActive &&
      !this.laserCooldown
    ) {
      this.escudoActive = true;
      this.laserCooldown = true;
      if (this.botonHabilidad) this.botonHabilidad.setTint(0x444444); // Oscurecer botón
      this.escudoHits = 3;
      this.escudoSprite = this.physics.add.sprite(this.player.x, this.player.y, 'escudo');
      this.escudoSprite.setOrigin(0.5, 0.5);
      this.escudoSprite.setDepth(1001);
      this.escudoSprite.setScale(1.2);
      // Desactivar colisión jugador-balas
      if (this.playerBulletsCollider) this.playerBulletsCollider.active = false;
      // Colisión entre escudo y balas enemigas
      this.escudoCollider = this.physics.add.overlap(this.escudoSprite, this.bullets, (escudo, enemyBullet) => {
        this.escudoHits--;
        enemyBullet.destroy();
        if (this.escudoHits <= 0) {
          this.escudoActive = false;
          if (this.escudoSprite) {
            this.escudoSprite.destroy();
            this.escudoSprite = null;
          }
          if (this.escudoCollider) {
            this.escudoCollider.destroy();
            this.escudoCollider = null;
          }
          // Reactivar colisión jugador-balas
          if (this.playerBulletsCollider) this.playerBulletsCollider.active = true;
          // Cancelar temporizador si existe
          if (this.escudoTimer) {
            this.escudoTimer.remove(false);
            this.escudoTimer = null;
          }
          // Iniciar recarga de 5 segundos adicionales
          this.laserRechargeTimer = this.time.delayedCall(5000, () => {
            this.laserCooldown = false;
            if (this.botonHabilidad) this.botonHabilidad.setTint(0xffffff); // Restaurar color
          });
        }
      });
      this.escudoTimer = this.time.delayedCall(5000, () => {
        this.escudoActive = false;
        if (this.escudoSprite) {
          this.escudoSprite.destroy();
          this.escudoSprite = null;
        }
        if (this.escudoCollider) {
          this.escudoCollider.destroy();
          this.escudoCollider = null;
        }
        // Reactivar colisión jugador-balas
        if (this.playerBulletsCollider) this.playerBulletsCollider.active = true;
        // Iniciar recarga de 5 segundos adicionales
        this.laserRechargeTimer = this.time.delayedCall(5000, () => {
          this.laserCooldown = false;
          if (this.botonHabilidad) this.botonHabilidad.setTint(0xffffff); // Restaurar color
        });
      });
    }
    // Si el láser está activo, seguir la nave
    if (this.laserActive) {
      for (let i = 0; i < this.laserSprites.length; i++) {
        const laserY = this.player.y - 0 - i * this.laserSpacing;
        this.laserSprites[i].x = this.player.x;
        this.laserSprites[i].y = laserY;
      }
    }
    // Si el escudo está activo, seguir la nave
    if (this.escudoActive && this.escudoSprite) {
      this.escudoSprite.x = this.player.x;
      this.escudoSprite.y = this.player.y;
    }

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

    // --- Ocultar texto de controles cuando se presionen todas las teclas de movimiento (solo flechas) ---
    if (this.controlesMostrados) {
      if (this.cursors.up.isDown) this.teclasPresionadas.up = true;
      if (this.cursors.down.isDown) this.teclasPresionadas.down = true;
      if (this.cursors.left.isDown) this.teclasPresionadas.left = true;
      if (this.cursors.right.isDown) this.teclasPresionadas.right = true;
      if (this.teclasPresionadas.up && this.teclasPresionadas.down && this.teclasPresionadas.left && this.teclasPresionadas.right) {
        this.textoControles.destroy();
        this.controlesMostrados = false;
      }
    }
    // --- Ocultar texto de ayuda de disparo (barra espaciadora) ---
    if (this.controlesBMostrados) {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
        this.teclasBPresionadas.SPACE = true;
        if (this.textoControlesB) {
          this.textoControlesB.destroy();
          this.controlesBMostrados = false;
        }
      }
    }
  }
}
