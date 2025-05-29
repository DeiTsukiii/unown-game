import { ressources } from "../ressources/ressources.js";

export default class Toggle {
    constructor(scene, name, pos, color = [0x00ff00, 0xff0000]) {
        this.scene = scene;
        this.name = name;
        this.pos = pos;
        this.text = this.scene.add.text(pos.x - 240, pos.y, `${name} :`, {
            font: '16px PressStart2P',
            fill: '#979571'
        }).setOrigin(0, 0.5).setInteractive();
        this.button = this.scene.add.image(pos.x, pos.y, 'toggleButton').setScale(4).setInteractive();
        const data = ressources.getData();
        const state = data.settings[name] ? [40, color[0]] : [-40, color[1]];
        this.buttonToggle = this.scene.add.image(pos.x + state[0], pos.y, 'toggle').setScale(4).setTint(state[1]);

        this.button.on('pointerdown', () => {
            this.scene.sound.play('buttonClick', { loop: false, volume: 0.5 });
            if (this.buttonToggle.x === pos.x - 40) {
                this.slideToggle(pos.x + 40, color[0]);
            } else {
                this.slideToggle(pos.x - 40, color[1]);
            }
            this.applySetting(ressources.getData(), this.buttonToggle.x === pos.x - 40);
        });
    }

    applySetting(data, state) {
        data.settings[this.name] = state;
        ressources.saveData(data);
    }

    slideToggle(targetX, color) {
        this.scene.tweens.add({
            targets: this.buttonToggle,
            x: targetX,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                this.buttonToggle.setTint(color);
            }
        });
    };

    changeText(newText) {
        this.text.setText(newText);
    }
}