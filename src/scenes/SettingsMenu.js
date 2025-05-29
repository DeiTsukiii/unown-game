import { ressources } from "../ressources/ressources.js";
import Toggle from "../UI/toggle.js";

export default class SettingsMenu extends Phaser.Scene {
    constructor() {
        super('SettingsMenu');
    }

    create() {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'pauseMenu').setScale(7);
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.5)');

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 310, 'Settings', {
            font: '20px PressStart2P',
            fill: '#979571',
            align: 'center'
        }).setOrigin(0.5);

        const musicScene = this.scene.get('MusicScene');
        const musicToggle = new Toggle(this, 'Music', {x: this.cameras.main.centerX + 90, y: this.cameras.main.centerY - 200});
        musicToggle.button.on('pointerdown', () => {
            musicScene.playPauseMusic(true);
            musicScene.toggleMusic(musicToggle.buttonToggle.x === musicToggle.pos.x - 40);
            musicScene.playPauseMusic(false);
        });

        const keysToggle = new Toggle(this, 'WASD', {x: this.cameras.main.centerX + 90, y: this.cameras.main.centerY - 130}, []);
        keysToggle.changeText(keysToggle.buttonToggle.x === keysToggle.pos.x - 40 ? 'ZQSD :' : 'WASD :');
        keysToggle.button.on('pointerdown', () => {
            const newState = keysToggle.buttonToggle.x === keysToggle.pos.x - 40 ? 'WASD :' : 'ZQSD :';
        
            keysToggle.changeText(newState);
        
            const newKeys = newState === 'WASD :' ? ['W', 'D', 'A', 'S'] : ['Z', 'D', 'Q', 'S'];
        
            const newData = ressources.getData();
            newData.settings.keys.leftKey = newKeys[2];
            newData.settings.keys.upKey = newKeys[0];

            const gameScene = this.scene.get('GameScene')
            gameScene.cursors = gameScene.input.keyboard.addKeys({
                leftKey: Phaser.Input.Keyboard.KeyCodes[newData.settings.keys.leftKey],
                rightKey: Phaser.Input.Keyboard.KeyCodes[newData.settings.keys.rightKey],
                upKey: Phaser.Input.Keyboard.KeyCodes[newData.settings.keys.upKey],
                downKey: Phaser.Input.Keyboard.KeyCodes[newData.settings.keys.downKey],
                runKey: Phaser.Input.Keyboard.KeyCodes.SHIFT
            });
        
            window.localStorage.setItem('data', JSON.stringify(newData));
        });

        const ftfToggle = new Toggle(this, 'Fast text\nflow', {x: this.cameras.main.centerX + 90, y: this.cameras.main.centerY - 60});

        const backButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 220, 'backButton')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(6);

        backButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
            this.scene.start('PauseMenu');
            this.scene.stop();
        });

        if (this.scene.isActive('GameScene')) {
            this.scene.pause('GameScene');
        }

        this.input.keyboard.on('keydown', (event) => {
            if (event.code === 'Escape' && !event.repeat) {
                this.scene.resume('GameScene');
                this.scene.stop();
                const musicScene = this.scene.get('MusicScene');
                musicScene.playPauseMusic(true);
            }
        });
    }
}