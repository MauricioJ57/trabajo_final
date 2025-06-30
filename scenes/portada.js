export default class portada extends Phaser.Scene {
  constructor() {
    super("portada");
  }

  init () {

  }

  preload () {
    this.load.image('fondo de boton', 'public/assets/fondo de boton.png');
    this.load.image('boceto nave 1', 'public/assets/boceto nave 1.png');
    this.load.image('fondo de portada', "public/assets/fondo de portada.jpg");
    this.load.image('logo del juego', "public/assets/logo del juego.png");

  }

  create () {
    this.add.image(0, 500, 'fondo de portada');

    this.add.image(350, 300, 'logo del juego');

    const image = this.add.image(0, 0, 'fondo de boton').setScale(1);

    const container = this.add.container(350, 400, [image]);
    container.setSize(300, 100);
    container.setInteractive();
    container.on('pointerover', () => {
      image.setTint(0xf0000); // Change color to yellow on hover
    })
    container.on('pointerout', () => {
      image.clearTint();
    })

    container.once('pointerup', () => {
      this.scene.start('gameplay');
    });

    this.add.text(350, 400, "JUGAR", { 
        fontFamily: 'arial',
        fontSize: '32px', 
        fill: '#fff' 
    }).setOrigin(0.5,0.5);

  }

  update () {

  }
  
}