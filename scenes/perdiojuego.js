export default class perdio extends Phaser.Scene {
    constructor() {
        super("perdiojuego")
    }

    init() {

    }

    preload() {

    }

    create(data) {
        // Mostrar los datos recibidos
        this.add.text(350, 200, `Score: ${data.score || 0}`, {
            fontSize: '40px',
            fill: '#fff',
            fontFamily: 'arial',
        }).setOrigin(0.5);
        this.add.text(350, 260, `Tiempo total: ${data.tiempoTotal || 0} s`, {
            fontSize: '40px',
            fill: '#fff',
            fontFamily: 'arial',
        }).setOrigin(0.5);
        this.add.text(350, 320, `Oleada: ${data.oleada || 1}`, {
            fontSize: '40px',
            fill: '#fff',
            fontFamily: 'arial',
        }).setOrigin(0.5);

        this.restartKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.R
        );// controles
    }

    update() {
        if (this.restartKey.isDown) {
        this.scene.start("portada");
        } // boton de reinicio
        
    }
}