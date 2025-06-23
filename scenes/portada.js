export default class portada extends Phaser.Scene {
  constructor() {
    super("portada");
  }

  init () {

  }

  preload () {
    this.load.image('fondo de boton', 'public/assets/fondo de boton.png');

  }

  create () {
    this.add.image(350, 400, 'fondo de boton');
    this.add.text(350, 350, "JUGAR", { 
        fontFamily: 'arial',
        fontSize: '64px', 
        fill: '#fff' 
    }).setOrigin(0.5,0.5);

  }

  update () {

  }
  
}