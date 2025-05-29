import { ressources } from '../ressources/ressources.js';
import Characters from './characters.js';

export default class Player extends Characters {
    constructor(scene) {
        const data = ressources.getData();
        const animations = {
            left: [6, 8],
            right: [9, 11],
            up: [0, 2],
            down: [3, 5]
        }
        super(scene, [`playerWalk${data.player.gender}`, `playerRun${data.player.gender}`], animations);

        this.gender = data.player.gender;
        this.canMove = true;

        this.lastKey = undefined;
        this.scene.input.keyboard.on('keydown', event => {
            const keys = data.settings.WASD ? ['w', 'a', 's', 'd'] : ['z', 'q', 's', 'd'];
            const key = event.key.toLowerCase();
            if (keys.includes(key)) {
                this.lastKey = key;
            }
        });
    }

    playerMove() {
        const isRunning = this.scene.cursors.runKey.isDown;
        this.speed = isRunning ? 70 : 35;

        const keys = ressources.getData().settings.WASD ? ['w', 'a', 's', 'd'] : ['z', 'q', 's', 'd'];
        const spriteSheet = isRunning ? `playerRun${this.gender}` : `playerWalk${this.gender}`;
        if (!this.canMove) {
            super.move("", spriteSheet);
        } else if (this.scene.cursors.leftKey.isDown && this.lastKey === keys[1]) {
            super.move("left", spriteSheet);
        } else if (this.scene.cursors.rightKey.isDown && this.lastKey === keys[3]) {
            super.move("right", spriteSheet);
        } else if (this.scene.cursors.upKey.isDown && this.lastKey === keys[0]) {
            super.move("up", spriteSheet);
        } else if (this.scene.cursors.downKey.isDown && this.lastKey === keys[2]) {
            super.move("down", spriteSheet);
        } else {
            super.move("", spriteSheet);
        }
    }
}
