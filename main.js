import gameplay from "./scenes/gameplayjuego.js";
import pantallaSeleccion from "./scenes/pantalla_seleccion.js";
import perdio from "./scenes/perdiojuego.js";
import portada from "./scenes/portada.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [portada,pantallaSeleccion,gameplay,perdio],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
