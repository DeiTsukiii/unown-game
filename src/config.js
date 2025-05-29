import { scenes } from "./scenes/loadScene.js";

export const CONFIG = {
    type: Phaser.AUTO,
    backgroundColor: '#000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1800,
        height: 1080,
    },
    pixelArt: true,
    input: {
        activePointers: 3,
    },
    scene: scenes,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
}