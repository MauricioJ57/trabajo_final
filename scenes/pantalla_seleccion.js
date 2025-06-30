export default class pantallaSeleccion extends Phaser.Scene {
    constructor() {
        super("pregameplay");
    }

    init () {

    }

    preload() {
        this.load.image('hudselector', "public/assets/hud de selector2.png")
    }

    create() {
        this.add.image(0, 0, 'hudselector').setOrigin(0, 0);
    }

    update() {

    }
}