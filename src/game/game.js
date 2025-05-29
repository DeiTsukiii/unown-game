import Player from "../characters/player.js";
import { ressources } from "../ressources/ressources.js";

export default class Game {
    constructor(scene, mapName, canPause) {
        this.scene = scene;
        this.canPause = canPause;
        this.inItem = false;

        this.loadControls();
        this.loadPlayer();
        this.loadMap(mapName);
        this.loadMusic('SourRock');
        this.loadCamera();
        this.loadInteractions();
    }

    loadControls() {
        const data = ressources.getData();
        this.scene.cursors = this.scene.input.keyboard.addKeys({
            leftKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.leftKey],
            rightKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.rightKey],
            upKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.upKey],
            downKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.downKey],
            runKey: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });
    }

    loadPlayer() {
        this.player = new Player(this.scene);
    }

    loadMap(mapName) {
        this.map = this.scene.make.tilemap({ key: mapName, tileWidth: 16, tileHeight: 16 });
        this.layers = [];
        this.collidesGroup = this.scene.physics.add.staticGroup();
        this.doorsGroup = this.scene.physics.add.staticGroup();
        this.interactionGroup = this.scene.physics.add.staticGroup();

        // Load the map
        this.map.layers.forEach(layerData => {
            const tilesetName = layerData.properties.find(prop => prop.name === 'tileset')?.value;
            if (tilesetName) {
                const tileset = this.map.addTilesetImage(tilesetName, tilesetName);
                const layer = this.map.createLayer(layerData.name, tileset, 0, 0);
                if (layerData.name.includes("up")) layer.setDepth(100);
                this.layers.push(layer);
            }
        });
        this.scene.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Load collides
        const collidesLayer = this.map.getObjectLayer('collides');
        if (collidesLayer && collidesLayer.objects) {
            collidesLayer.objects.forEach(obj => {
                this.collidesGroup.create(obj.x, obj.y, null)
                    .setVisible(false)
                    .setSize(obj.width, obj.height)
                    .setOffset(16, 16)
                    .setOrigin(0, 0);
            });
        }

        const utilitiesLayer = this.map.getObjectLayer('utilities');

        // Load Spawn
        if (utilitiesLayer) {
            const spawnPoint = utilitiesLayer.objects.find(obj => obj.name === 'SpawnPoint');
            if (spawnPoint) {
                this.player.setPosition(spawnPoint.x, spawnPoint.y);
            }
        }

        // Load doors
        const enterDoor = (door) => {
            const from = door.from.split('/');
            const to = door.to.split('/');

            if (from[0] === to[0]) {
                this.player.canMove = false;
                ressources.easeOut(this.scene, () => {
                    const utilitiesLayer = this.map.getObjectLayer('utilities');
                    const toPos = utilitiesLayer.objects.find(obj => obj.name === `Spawn/${door.from}`);
                    this.player.setPosition(toPos.x, toPos.y);
                    ressources.easeIn(this.scene, () => {
                        this.player.canMove = true;
                    });
                });
            } else {
                this.player.canMove = false;
                ressources.easeOut(this.scene, () => {
                    this.changeMap(to[0])
                    const utilitiesLayer = this.map.getObjectLayer('utilities');
                    const toPos = utilitiesLayer.objects.find(obj => obj.name === `Spawn/${door.from}`);
                    this.player.setPosition(toPos.x, toPos.y);
                    ressources.easeIn(this.scene, () => {
                        this.player.canMove = true;
                    });
                });
            }
        }
        
        // load doors
        const doors = utilitiesLayer.objects.filter(obj => obj.name === 'door'); 
        doors.forEach(obj => {
            const door = this.doorsGroup.create(obj.x, obj.y, null)
                .setVisible(false)
                .setSize(obj.width, obj.height)
                .setOffset(16, 16)
                .setOrigin(0, 0);

            door.from = obj.properties?.find(p => p.name === "from")?.value || null;
            door.to = obj.properties?.find(p => p.name === "to")?.value || null;
        });

        this.scene.physics.add.overlap(this.player.obj, this.doorsGroup, (player, door) => {
            enterDoor(door);
        }, null, this);

        // Load interactions
        const interactions = utilitiesLayer.objects.filter(obj => obj.name === 'interaction');
        interactions.forEach(obj => {
            const interact = this.interactionGroup.create(obj.x, obj.y, null)
                .setVisible(false)
                .setSize(obj.width, obj.height)
                .setOffset(16, 16)
                .setOrigin(0, 0);
            interact.item = obj.properties?.find(p => p.name === 'item')?.value;

            this.scene.physics.add.overlap(this.player.obj, this.interactionGroup, (player, interact) => {
                this.inItem = interact.item;
            }, null, this);
        });
    }

    changeMap(mapName) {
        console.log(mapName)
        this.scene.physics.world.colliders.destroy();

        this.map.destroy();
        this.layers.forEach(layer => layer.destroy());
        this.collidesGroup.destroy();
        this.doorsGroup.destroy();

        this.loadMap(mapName);

        this.scene.physics.add.collider(this.player.obj, this.collidesGroup);
    }


    loadMusic(music) {
        this.changeMusic(music);
        this.playPauseMusic(true);
    }

    changeMusic(music) {
        const musicScene = this.scene.scene.get('MusicScene');
        musicScene.changeMusic(music);
    }

    playPauseMusic(state) {
        const musicScene = this.scene.scene.get('MusicScene');
        musicScene.playPauseMusic(state);
    }

    loadCamera() {
        this.scene.cameras.main.startFollow(this.player.obj);
        this.scene.cameras.main.setLerp(0.1, 0.1);
        this.scene.cameras.main.setZoom(8);
    }

    loadInteractions() {
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.code === 'Escape' && !event.repeat && this.canPause) {
                this.scene.scene.launch('PauseMenu');
                this.scene.scene.pause();
            } else if (event.code === 'Space') {
                if (this.inItem !== false) this.scene.scene.launch('DialogueScene', { key: 'interaction', canSkip: false, pause: true, scene: this.scene, dialogue: ['interactions', this.inItem] });
            }
        });
    }

    update(time, delta) {
        this.player.playerMove();
    }
}