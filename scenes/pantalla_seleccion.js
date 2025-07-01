export default class pantallaSeleccion extends Phaser.Scene {
    constructor() {
        super("pregameplay");
    }

    init () {

    }

    preload() {
        this.load.image('hudselector', "public/assets/hud de selector2.png");
        this.load.image('navedashselector', "public/assets/boton de nave dash.png");
        this.load.image('naveescudoselector', "public/assets/boton de nave escudo.png");
        this.load.image('naverayograndeselector', "public/assets/nave rayo grande.png");
        this.load.image('ejemploselector', "public/assets/ejemplo de interfaz de seleccion.png");
        this.load.image('fondo de portada', "public/assets/fondo de portada.jpg");
        this.load.image('boton de nave', "public/assets/boton de nave.png");
        this.load.image('nave seleccionada', "public/assets/imagen de nave seleccionada.png");
        this.load.image('boton jugar', "public/assets/boton jugar.png");
        this.load.image('ejemplo nave escudo', "public/assets/nave escudo.png");
        this.load.image('ejemplo nave dash', "public/assets/New Piskel.png");
        this.load.image('ejemplo nave rayo grande', "public/assets/boceto nave 1.png");
    }

    create() {
        this.add.image(0, 500, 'fondo de portada');

        this.add.image(34, 247, 'boton de nave', "public/assets/boton de nave.png").setOrigin(0, 0);

        this.add.image(567, 184, 'nave seleccionada').setOrigin(0, 0);

        this.add.image(0, 0, 'hudselector').setOrigin(0, 0);

        const dash = this.add.image(0, 0, 'navedashselector');

        const container_d = this.add.container(260, 240, [dash]);
        container_d.setSize(180, 180);
        container_d.setInteractive();
        container_d.on('pointerover', () => {
          dash.setTint(0xffaaaa); // Change color to yellow on hover
        })
        container_d.on('pointerout', () => {
          dash.clearTint();
        })

        // Variable para la nave seleccionada
        this.naveSeleccionada = null;
        this.navePreview = null; // Sprite de la nave seleccionada en pantalla
        // Mostrar selección y guardar valor
        container_d.on('pointerup', () => {
          this.naveSeleccionada = 'ejemplo nave dash';
          if (this.navePreview) this.navePreview.destroy();
          this.navePreview = this.add.image(590, 250, 'ejemplo nave dash').setOrigin(0, 0);
        });

        const escudo = this.add.image(0, 0, 'naveescudoselector')

        const container_e = this.add.container(260, 430, [escudo]);
        container_e.setSize(180, 180);
        container_e.setInteractive();
        container_e.on('pointerover', () => {
          escudo.setTint(0xffaaaa); // Change color to yellow on hover
        })
        container_e.on('pointerout', () => {
          escudo.clearTint();
        })

        container_e.on('pointerup', () => {
          this.naveSeleccionada = 'ejemplo nave escudo';
          if (this.navePreview) this.navePreview.destroy();
          this.navePreview = this.add.image(600, 250, 'ejemplo nave escudo').setOrigin(0, 0);
        });

        const rayo_grande = this.add.image(0, 0, 'naverayograndeselector');

        const container_rg = this.add.container(450, 240, [rayo_grande]);
        container_rg.setSize(180, 180);
        container_rg.setInteractive();
        container_rg.on('pointerover', () => {
          rayo_grande.setTint(0xffaaaa); // Change color to yellow on hover
        })
        container_rg.on('pointerout', () => {
          rayo_grande.clearTint();
        })

        container_rg.on('pointerup', () => {
          this.naveSeleccionada = 'ejemplo nave rayo grande';
          if (this.navePreview) this.navePreview.destroy();
          this.navePreview = this.add.image(590, 250, 'ejemplo nave rayo grande').setOrigin(0, 0);
        });
        
        const botonJugar = this.add.image(0, 0, 'boton jugar');
        
        const container_jugar = this.add.container(350, 650, [botonJugar]);
        container_jugar.setSize(300, 200);
        container_jugar.setInteractive()
        container_jugar.on('pointerover', () => {
          botonJugar.setTint(0xffaaaa); // Change color to yellow on hover
        });
        container_jugar.on('pointerout', () => {
          botonJugar.clearTint();
        });

        container_jugar.once('pointerup', () => {
          // Si no se seleccionó nave, por defecto la de escudo
          const nave = this.naveSeleccionada || 'ejemplo nave escudo';
          this.scene.start('gameplay', { naveSeleccionada: nave });
        });

        this.add.text(280, 620, "JUGAR", { 
        fontFamily: 'arial',
        fontSize: '40px', 
        fill: '#fff' 
        }).setOrigin(0, 0);

        
    }

    update() {

    }
}