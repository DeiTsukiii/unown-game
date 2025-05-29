import { ressources } from "../ressources/ressources.js";

export default class MusicScene extends Phaser.Scene {
    constructor() {
        super('MusicScene');
    }

    create() {
        this.music = this.sound.add('Pixelland', { loop: true });
        const data = ressources.getData();
        this.music.setVolume(data.settings.Music ? 0.5 : 0);
        this.music.play();
        this.music.pause();
    }

    toggleMusic(state) {
        state ? this.music.setVolume(0.5) : this.music.setVolume(0);
    }

    playPauseMusic(state) {
        state ? this.music.resume() : this.music.pause();
    }

    changeMusic(name) {
        this.music.stop();
        this.music = this.sound.add(name, { loop: true });
        const data = ressources.getData();
        this.music.setVolume(data.settings.Music ? 0.5 : 0);
        this.music.play();
        this.music.pause(); 
    }
}