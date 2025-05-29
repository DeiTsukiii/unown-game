import { ressources } from "../../ressources/ressources.js";
import Game from "../../game/game.js";

export class Oppening2 extends Phaser.Scene {
    constructor() {
        super('Oppening2');
    }

    easeIn(onComplete) {
        ressources.easeIn(this, onComplete);
    }

    easeOut(onComplete) {
        ressources.easeOut(this, onComplete);
    }

    spawn() {
        this.game = new Game(this, 'ArrivalMap', true);
        this.easeIn()
        this.spawnPidgey();
    }

    spawnPidgey() {
        const utilitiesLayer = this.game.map.getObjectLayer('utilities');
        const pidgeyPos = utilitiesLayer.objects.find(obj => obj.name === 'pidgey');
        const pidgey = this.physics.add.sprite(pidgeyPos.x, pidgeyPos.y, 'pidgey')
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(10);
        this.anims.create({
            key: 'pidgeyFly',
            frames: this.anims.generateFrameNumbers('pidgey', {
                start: 0,
                end: 5
            }),
            frameRate: 12,
            repeat: -1
        });
        pidgey.anims.play('pidgeyFly', true);
        this.cameras.main.startFollow(pidgey);
        pidgey.setVelocityX(-50);
        setTimeout(() => {
            this.easeOut(() => {
                pidgey.setVelocityX(0);
                pidgey.destroy();
                this.spawnCaterpie();
            });
        }, 3000);
    }

    spawnCaterpie() {
        this.easeIn();
        const utilitiesLayer = this.game.map.getObjectLayer('utilities');
        const caterpiePos = utilitiesLayer.objects.find(obj => obj.name === 'caterpie');
        const caterpie = this.physics.add.sprite(caterpiePos.x, caterpiePos.y, 'caterpie')
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(10);
        this.anims.create({
            key: 'caterpieMove',
            frames: this.anims.generateFrameNumbers('caterpie', {
                start: 0,
                end: 5
            }),
            frameRate: 12,
            repeat: -1
        });
        caterpie.anims.play('caterpieMove', true);
        this.cameras.main.startFollow(caterpie);
        caterpie.setVelocityX(-50);
        setTimeout(() => {
            this.easeOut(() => {
                this.spawnPlayer();
                caterpie.setVelocityX(0);
                caterpie.destroy();
            });
        }, 3000);
    }

    spawnPlayer() {
        this.game.changeMap('house1');
        const utilitiesLayer = this.game.map.getObjectLayer('utilities');
        const pcPos = utilitiesLayer.objects.find(obj => obj.name === 'pc');
        const pc = this.physics.add.sprite(pcPos.x, pcPos.y, 'pc')
            .setOrigin(0)
            .setScale(1)
            .setDepth(10);
        this.anims.create({
            key: 'pcOff',
            frames: this.anims.generateFrameNumbers('pc', {
                start: 0,
                end: 5
            }),
            frameRate: 30,
            repeat: 0
        });
        this.easeIn(() => {
            pc.anims.play('pcOff', true);
        });
        const playerPos = utilitiesLayer.objects.find(obj => obj.name === 'firstSpawn');
        this.game.player.setPosition(playerPos.x, playerPos.y);

        this.cameras.main.startFollow(this.game.player.obj);
    }

    create() {
        this.spawn();

        // // Utilities
        // const utilitiesLayer = this.game.map.getObjectLayer('utilities');

        // // Load celebi
        // const celebiPos = utilitiesLayer.objects.find(obj => obj.name === 'celebi');
        // const celebi = this.physics.add.sprite(celebiPos.x, celebiPos.y, 'celebi')
        //     .setOrigin(0.5, 1)
        //     .setScale(0.4)
        //     .setDepth(10)
        //     .setAlpha(0.1)
        //     .setTint(0x000000);
        // this.anims.create({
        //     key: 'celebiIdle',
        //     frames: this.anims.generateFrameNumbers('celebi', {
        //         start: 0,
        //         end: 15
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // celebi.anims.play('celebiIdle', true);

        // // Load cave entry
        // const caveEntryPos = utilitiesLayer.objects.find(obj => obj.name === 'caveEntry');
        // const caveEntry = this.physics.add.sprite(caveEntryPos.x, caveEntryPos.y, 'caveOpened').setOrigin(0);
        // this.anims.create({
        //     key: 'caveOpening',
        //     frames: this.anims.generateFrameNumbers('caveOpened', {
        //         start: 0,
        //         end: 4
        //     }),
        //     frameRate: 20,
        //     repeat: 0
        // });
        // caveEntry.anims.play('caveOpening', true);
        // this.game.player.moveTo({x: 320, y: 96}, `playerWalk${this.game.player.gender}`)
        // const caveEntryPos = utilitiesLayer.objects.find(obj => obj.name === 'caveEntry');
        // const caveEntry = this.physics.add.sprite(caveEntryPos.x, caveEntryPos.y, 'pidgey').setOrigin(0);
        // this.anims.create({
        //     key: 'pidgeyFly',
        //     frames: this.anims.generateFrameNumbers('pidgey', {
        //         start: 0,
        //         end: 5
        //     }),
        //     frameRate: 11,
        //     repeat: -1
        // });
        // caveEntry.anims.play('pidgeyFly', true);
    }

    update(time, delta) {
        this.game.update(time, delta);
    }
}

export class Oppening extends Phaser.Scene {
    constructor() {
        super('Oppening');
        this.gender = undefined;
        this.name = undefined;
    }

    loadScene() {
        this.cameras.main.setBackgroundColor('#f1f1f1');
        const data = ressources.getData();
        const volumeButton = this.add.image(50, 50, data.settings.Music ? 'volumeButtonOn' : 'volumeButtonOff').setScale(4).setInteractive();
        const musicScene = this.scene.get('MusicScene');
        musicScene.changeMusic('Monplaisir');
        musicScene.playPauseMusic(true);
        volumeButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { loop: false, volume: 0.5 });
        
            const isMuted = volumeButton.texture.key === 'volumeButtonOn';
        
            volumeButton.setTexture(isMuted ? 'volumeButtonOff' : 'volumeButtonOn');
            musicScene.toggleMusic(!isMuted);
            const data = ressources.getData();
            data.settings.Music = !isMuted;
            window.localStorage.setItem('data', JSON.stringify(data));
        });

        this.profSprite = this.physics.add.sprite(this.cameras.main.centerX, 200, 'profIntro')
            .setBounce(0)
            .setOrigin(0.5, 0)
            .setCollideWorldBounds(true)
            .setScale(5)
            .setDepth(10);
        
        this.profHead = this.physics.add.sprite(this.cameras.main.centerX, 200, 'profIntro')
            .setBounce(0)
            .setOrigin(0.5, 0)
            .setCollideWorldBounds(true)
            .setScale(5)
            .setDepth(10)
            .setVisible(false);

        this.pokeball = this.physics.add.sprite(this.cameras.main.centerX - 100, 300, 'pokeballIntro')
            .setBounce(0)
            .setOrigin(0.5, 0)
            .setCollideWorldBounds(true)
            .setScale(5)
            .setDepth(10)
            .setVisible(false);
        
        this.ralts = this.physics.add.sprite(this.cameras.main.centerX - 100, 670, 'raltsIntro')
            .setBounce(0)
            .setOrigin(0.5, 0)
            .setCollideWorldBounds(true)
            .setScale(5)
            .setDepth(10)
            .setVisible(false);
        
        [
            { key: 'profIntroIdle', frames: [0, 9], frameRate: 12, repeat: 0, sheet: 'profIntro' },
            { key: 'profIntroLunchPokeball', frames: [12, 22], frameRate: 18, repeat: 0, sheet: 'profIntro' },
            { key: 'profIntroTalk', frames: [11, 10], frameRate: 7, repeat: -1, sheet: 'profIntro' },
            { key: 'pokeballFlip', frames: [0, 3], frameRate: 12, repeat: -1, sheet: 'pokeballIntro' },
            { key: 'raltsIdle', frames: [0, 13], frameRate: 8, repeat: -1, sheet: 'raltsIntro' }
        ].forEach(({ key, frames, frameRate, repeat, sheet }) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(sheet, {
                    start: frames[0],
                    end: frames[1]
                }),
                frameRate,
                repeat
            });
        });

        this.pokeball.anims.play('pokeballFlip', true);
        
        const dialogueScene = this.scene.get('DialogueScene');
        dialogueScene.events.on('dialogueTypingStart', () => {
            if (dialogueScene.fix) return;
            this.profHead.anims.play('profIntroTalk', true);
            this.profHead.setVisible(true);
        });
        dialogueScene.events.on('dialogueTypingFinish', () => {
            if (dialogueScene.fix) return;
            this.profHead.anims.play('profIntroTalk', false); 
            this.profHead.setVisible(false);
        });
    }

    spawn() {
        const blackScreen = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(1)
            .setDepth(9999);
    
        this.tweens.add({
            targets: blackScreen,
            alpha: 0,
            duration: 600,
            onComplete: () => {
                this.scene.launch('DialogueScene', {key: 'spawn', canSkip: false, pause: false, scene: this, dialogue: ['Oppening', 0]});
    
                const idleInterval = setInterval(() => {
                    if (this.profSprite) {
                        this.profSprite.anims.play('profIntroIdle', true);
                    }
                }, 2000);
    
                const dialogueScene = this.scene.get('DialogueScene');
                dialogueScene.events.on('dialogueComplete-spawn', () => {
                    clearInterval(idleInterval);
                    this.introducePokemon();
                });
            }
        });
    }
    

    introducePokemon() {
        this.profSprite.anims.play('profIntroLunchPokeball');
        const raltsSpawn = function () {
            this.pokeball.setVisible(false);
            this.ralts.setVisible(true);
            this.sound.play('raltsCrie', { loop: false, volume: 0.5 });
            this.ralts.anims.play('raltsIdle', true);
            this.scene.launch('DialogueScene', { key: 'introduce', canSkip: false, pause: false, scene: this, dialogue: ['Oppening', 1] });
        }
        setTimeout(() => {
            this.pokeball.setVisible(true);
            
            this.sound.play('pokeballLunch', { loop: false, volume: 0.5 });
            this.tweens.add({
                targets: this.pokeball,
                y: this.pokeball.y - 300,
                duration: 500,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: this.pokeball,
                        y: this.pokeball.y + 800,
                        duration: 400,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            this.sound.play('pokeballGround', { loop: false, volume: 0.5 });
                            this.tweens.add({
                                targets: this.pokeball,
                                y: this.pokeball.y - 50,
                                duration: 200,
                                ease: 'Quad.easeOut',
                                yoyo: true,
                                onComplete: () => {
                                    setTimeout(() => raltsSpawn.call(this), 80);
                                }
                            });
                        }
                    });
                }
            });
    
        }, 500);
        const dialogueScene = this.scene.get('DialogueScene');
        dialogueScene.events.on('dialogueComplete-introduce', () => {
            this.getInfo();
        });
    } 

    getInfo() {
        this.tweens.add({
            targets: this.ralts,
            y: this.ralts.y + 50,
            alpha: 0,
            duration: 500,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.ralts.setVisible(false);
    
                this.idleInterval = setInterval(() => {
                    this.profSprite.anims.play('profIntroIdle', true);
                }, 2000);
                
                this.scene.launch('DialogueScene', { key: 'getInfo', canSkip: false, pause: false, scene: this, dialogue: ['Oppening', 2] });
            }
        });
        const dialogueScene = this.scene.get('DialogueScene');
        dialogueScene.events.on('dialogueComplete-getInfo', () => {
            this.getGender();
        });
    }
    
    getGender() {
        this.gender = undefined;
        this.profHead.setVisible(false);
        this.tweens.add({
            targets: this.profSprite,
            alpha: 0,
            duration: 500,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.profSprite.setVisible(false);
                
                this.scene.launch('DialogueScene', { key: 'getGender', fix: true, pause: false, scene: this, dialogue: ['Oppening', 3] });
    
                const genderData = [
                    { name: 'male', x: this.cameras.main.centerX - (this.cameras.main.centerX / 2.5), scale: 3.2, image: 'selectGenderM' },
                    { name: 'female', x: this.cameras.main.centerX + (this.cameras.main.centerX / 2.5), scale: 3.2, image: 'selectGenderF' }
                ];
    
                const elements = genderData.map(gender => {
                    const card = this.add.image(gender.x, 820, 'pauseMenu')
                        .setOrigin(0.5, 1)
                        .setScale(7.5)
                        .setInteractive()
                        .setAlpha(0);
    
                    const icon = this.add.image(gender.x, 768, gender.image)
                        .setOrigin(0.5, 1)
                        .setScale(gender.scale)
                        .setAlpha(0);
    
                    this.tweens.add({
                        targets: [card, icon],
                        x: gender.x,
                        alpha: 1,
                        duration: 800,
                        ease: 'Quad.easeOut'
                    });
    
                    card.on('pointerover', () => {
                        card.setScale(7.8);
                        icon.setScale(3.3);
                        icon.setY(icon.y - 3);
                    });
    
                    card.on('pointerout', () => {
                        card.setScale(7.5);
                        icon.setScale(gender.scale);
                        icon.setY(icon.y + 3);
                    });
    
                    return { card, icon };
                });
    
                const dialogueScene = this.scene.get('DialogueScene');
                const stop = () => {
                    this.tweens.add({
                        targets: elements.flatMap(e => [e.card, e.icon]),
                        alpha: 0,
                        duration: 500,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            elements.forEach(e => {
                                e.card.setVisible(false);
                                e.icon.setVisible(false);
                            });
                            this.confirmGender();
                        }
                    });
    
                    dialogueScene.nextPage();
                    this.sound.play('buttonClick', { loop: false, volume: 0.5 });
                };
    
                elements[0].card.on('pointerdown', () => {
                    if (this.gender) return;
                    this.gender = 'M';
                    stop.call(this);
                });
    
                elements[1].card.on('pointerdown', () => {
                    if (this.gender) return;
                    this.gender = 'F';
                    stop.call(this);
                });
            }
        });
    }

    confirmGender() {
        this.profSprite.setVisible(true);
        this.tweens.add({
            targets: this.profSprite,
            alpha: 1,
            duration: 800,
            ease: 'Quad.easeOut',
        });
    
        const gender = ressources.getLanguage().gender[this.gender];
        this.scene.launch('DialogueScene', { key: 'confirmGender', responses: true, fix: true, pause: false, scene: this, dialogue: ['Oppening', 4, {gender}] });
    
        const dialogueScene = this.scene.get('DialogueScene');
    
        dialogueScene.events.off('yesChoiced-confirmGender');
        dialogueScene.events.off('noChoiced-confirmGender');
    
        dialogueScene.events.on('yesChoiced-confirmGender', () => {
            dialogueScene.nextPage();
            setTimeout(() => this.introduceGetName(), 100);
        });
    
        dialogueScene.events.on('noChoiced-confirmGender', () => {
            dialogueScene.nextPage();
            this.gender = undefined;
            setTimeout(() => this.getGender(), 100);
        });
    }

    introduceGetName() {
        this.scene.launch('DialogueScene', { key: 'introduceGetName', canSkip: false, pause: false, scene: this, dialogue: ['Oppening', 5] });
        const dialogueScene = this.scene.get('DialogueScene');
        dialogueScene.events.on('dialogueComplete-introduceGetName', () => {
            this.getName();
        });
    }

    getName() {
        this.playerName = undefined;
        const dialogueScene = this.scene.get('DialogueScene');
        dialogueScene.events.off('dialogueComplete-getName');
        this.scene.launch('DialogueScene', { key: 'getName', input: true, pause: false, scene: this, dialogue: ['Oppening', 6] });
        dialogueScene.events.on('inputComplete-getName', (text) => {
            dialogueScene.nextPage();
            this.playerName = text;
            setTimeout(() => this.confirmName(), 500);
        });
    }
    
    confirmName() {
        const dialogueScene = this.scene.get('DialogueScene');
        
        if (this.isConfirming) return;
        
        this.isConfirming = true;
        
        dialogueScene.events.off('yesChoiced-confirmName');
        dialogueScene.events.off('noChoiced-confirmName');
        
        this.scene.launch('DialogueScene', { key: 'confirmName', responses: true, fix: true, pause: false, scene: this, dialogue: ['Oppening', 7, {playerName: this.playerName}] });
    
        dialogueScene.events.on('yesChoiced-confirmName', () => {
            dialogueScene.nextPage();
            this.isConfirming = false;
            this.end()
        });
    
        dialogueScene.events.on('noChoiced-confirmName', () => {
            dialogueScene.nextPage();
            this.playerName = undefined;
            this.isConfirming = false;
            setTimeout(() => this.getName(), 100);
        });
    }

    end() {
        this.scene.launch('DialogueScene', { key: 'end', canSkip: false, pause: false, scene: this, dialogue: ['Oppening', 8] });
    
        const dialogueScene = this.scene.get('DialogueScene');
        
        dialogueScene.events.on('dialogueComplete-end', () => {
            setTimeout(() => {
                const musicScene = this.scene.get('MusicScene');
                musicScene.playPauseMusic(false);
                clearInterval(this.idleInterval);
                const blackScreen = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
                    .setOrigin(0, 0)
                    .setAlpha(0)
                    .setDepth(9999);
        
                this.tweens.add({
                    targets: blackScreen,
                    alpha: 1,
                    duration: 600,
                    onComplete: () => {
                        const data = ressources.getData();
                        data.player = {
                            name: this.playerName,
                            gender: this.gender
                        }
                        ressources.saveData(data);
                        const dialogueScene = this.scene.get('DialogueScene');
                        dialogueScene.events.off('dialogueTypingStart');
                        dialogueScene.events.off('dialogueTypingFinish');
                        this.scene.start('Oppening2');
                    }
                });
            }, 1000);
        });
    }    

    create() {
        this.loadScene();
        this.spawn();

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY+100, 'introBackground').setScale(1.6);
    }
}
