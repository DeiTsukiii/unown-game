export default class PauseMenu extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        const musicScene = this.scene.get('MusicScene');
        musicScene.playPauseMusic(false);

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'pauseMenu').setScale(7);
        
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.5)');

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 310, 'Pause', {
            font: '30px PressStart2P',
            fill: '#979571',
            align: 'center'
        }).setOrigin(0.5);

        const startButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'startButton')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(6);

        const optionsButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'optionsButton')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(6);

        const exitButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'exitButton')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(6);

        startButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
            this.scene.resume('GameScene');
            this.scene.stop();
            musicScene.playPauseMusic(true);
        });

        optionsButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
            this.scene.start('SettingsMenu');
            this.scene.stop();
        });

        exitButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
            window.location.reload();
        });

        if (this.scene.isActive('GameScene')) {
            this.scene.pause('GameScene');
        }

        this.input.keyboard.on('keydown', (event) => {
            if (event.code === 'Escape' && !event.repeat) {
                this.scene.resume('GameScene');
                this.scene.stop();
                musicScene.playPauseMusic(true);
            }
        });
    }
}