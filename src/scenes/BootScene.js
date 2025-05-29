export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Progress bar
        this.cameras.main.setBackgroundColor('#000');
        const centerX = this.cameras.main.width / 2, centerY = this.cameras.main.height / 2;
        const loadingText = this.add.text(centerX, centerY - 50, 'Chargement...', { font: '40px Arial', fill: '#fff' }).setOrigin(0.5);
        const progressBar = this.add.graphics(), progressBox = this.add.graphics().fillStyle(0x222222, 0.8).fillRect(centerX - 160, centerY, 320, 50);
        this.load.on('progress', value => {progressBar.clear().fillStyle(0xffffff, 1).fillRect(centerX - 150, centerY + 10, 300 * value, 30);});
        this.load.once('complete', () => [progressBar, progressBox, loadingText].forEach(obj => obj.destroy()));

        // Fonts
        ['Zarbi', 'PressStart2P'].forEach(font => {
            this.load.font(font, `src/assets/font/${font}.ttf`);
        });

        // Maps
        ['Azuria', 'ArrivalMap', 'house1'].forEach(map => {
            this.load.tilemapTiledJSON(map, `src/assets/maps/${map}.json`);
        });

        // Tilesets
        ['pokemonTileset', 'pokemonTilesetUp', 'pokemonInside', 'pokemonInsideup'].forEach(tileset => {
            this.load.image(tileset, `src/assets/tileset/${tileset}.png`);
        });

        // Characters
        [['celebi', [37, 47]], ['playerWalkM', [32, 32]], ['playerRunM', [32, 32]], ['playerWalkF', [32, 32]], ['playerRunF', [32, 32]]].forEach(character => {
            this.load.spritesheet(character[0], `src/assets/sprites/${character[0]}.png`, { frameWidth: character[1][0], frameHeight: character[1][1] });
        });

        // Images
        ['mainMenuBackground', 'pauseMenu', 'playButton', 'playButtonPressed', 'validButton', 'validButtonPressed', 'startButton', 'optionsButton', 'exitButton', 'backButton', 'volumeButtonOn', 'volumeButtonOff', 'toggle', 'toggleButton', 'dialogueBox', 'dialogueCursor'].forEach(image => {
            this.load.image(image, `src/assets/UI/${image}.png`);
        });

        // Oppening
        // Images
        ['introBackground', 'selectGenderM', 'selectGenderF'].forEach(image => {
            this.load.image(image, `src/assets/scenes/Oppening/${image}.png`);
        });
        // Sprites
        [['pc', [16, 16]], ['pidgey', [59, 59]], ['caterpie', [50, 24]], ['profIntro', [58, 128]], ['pokeballIntro', [8, 8]], ['raltsIntro', [23, 39]]].forEach(spritesheet => {
            this.load.spritesheet(spritesheet[0], `src/assets/scenes/Oppening/${spritesheet[0]}.png`, { frameWidth: spritesheet[1][0], frameHeight: spritesheet[1][1] });
        });

        // Tutorial
        // Images
        [['caveOpened', [48, 48]]].forEach(spritesheet => {
            this.load.spritesheet(spritesheet[0], `src/assets/scenes/Tutorial/${spritesheet[0]}.png`, { frameWidth: spritesheet[1][0], frameHeight: spritesheet[1][1] });
        });

        // Musics
        ['SourRock', 'Pixelland', 'Monplaisir'].forEach(music => {
            this.load.audio(music, `src/assets/sounds/musics/${music}.mp3`);
        });

        // SFX
        ['buttonClick', 'dialoguePass', 'pokeballGround', 'pokeballLunch', 'raltsCrie', 'keyPress'].forEach(sound => {
            this.load.audio(sound, `src/assets/sounds/sfx/${sound}.mp3`);
        });
    }

    create() {
        this.scene.run('MusicScene');
        this.scene.start('MainMenu');
    }
}