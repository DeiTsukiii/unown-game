import { ressources } from "../ressources/ressources.js";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0E0E0E);
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'mainMenuBackground').setScale(6.7);
        const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'playButton').setScale(4).setInteractive();
        const data = ressources.getData();
        const volumeButton = this.add.image(130, 130, data.settings.Music ? 'volumeButtonOn' : 'volumeButtonOff').setScale(4).setInteractive();

        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY-50, 'Unown Game', {
            font: '200px zarbi',
            fill: '#979571',
            align: 'center'
        }).setOrigin(0.5);

        const musicScene = this.scene.get('MusicScene');
        musicScene.playPauseMusic(true);

        playButton.on('pointerdown', () => {
            playButton.off('pointerdown');
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
            playButton.setTexture('playButtonPressed');
            playButton.y += 4;

            this.time.delayedCall(200, () => {
                const musicScene = this.scene.get('MusicScene');
                musicScene.playPauseMusic(false);

                playButton.setTexture('playButton');
                playButton.y -= 4;

                setTimeout(() => {
                    const musicScene = this.scene.get('MusicScene');
                    musicScene.playPauseMusic(false);
                    const blackScreen = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
                        .setOrigin(0, 0)
                        .setAlpha(0)
                        .setDepth(9999);
            
                    this.tweens.add({
                        targets: blackScreen,
                        alpha: 1,
                        duration: 600,
                        onComplete: () => {
                            setTimeout(() => {
                                ressources.loadStep(this);
                            }, 300);
                        }
                    });
                }, 200);

            });
        });
        volumeButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
        
            const isMuted = volumeButton.texture.key === 'volumeButtonOn';
        
            volumeButton.setTexture(isMuted ? 'volumeButtonOff' : 'volumeButtonOn');
            musicScene.toggleMusic(!isMuted);
            const data = ressources.getData();
            data.settings.Music = !isMuted;
            window.localStorage.setItem('data', JSON.stringify(data));
        });        
    }
}