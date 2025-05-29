export default class Characters {
    constructor(scene, spriteSheets, animations) {
        this.scene = scene;
        this.obj = this.scene.physics.add.sprite(0, 0, spriteSheets[0])
            .setBounce(0)
            .setOrigin(0.5, 0.9)
            .setCollideWorldBounds(true)
            .setScale(0.75)
            .setDepth(10);

        this.speed = 70;

        const collideSize = {x: this.obj.width * 0.3, y: this.obj.height * 0.15};
        this.obj.setSize(collideSize.x, collideSize.y);
        this.obj.setOffset((this.obj.width - collideSize.x) / 2, this.obj.height - 6);

        spriteSheets.forEach(spriteSheet => {
            [
                { key: 'left', frames: animations.left },
                { key: 'right', frames: animations.right },
                { key: 'up', frames: animations.up },
                { key: 'down', frames: animations.down }
            ].forEach(({ key, frames }) => {
                this.scene.anims.create({
                    key: `${spriteSheet}${key}`,
                    frames: this.scene.anims.generateFrameNumbers(spriteSheet, {
                        start: frames[0],
                        end: frames[1]
                    }),
                    frameRate: 10,
                    repeat: -1
                });
            });
        });
    }

    move(direction, spriteSheet, customSpeed) {
        const speed = customSpeed !== undefined ? customSpeed : this.speed;
        this.obj.setVelocity(0);
        switch (direction) {
            case "left":
                this.obj.setVelocityX(-speed);
                if (!this.obj.anims.isPlaying || this.obj.anims.currentAnim.key !== `${spriteSheet}left`) {
                    this.obj.anims.play(`${spriteSheet}left`, true);
                }
                break;
            case "right":
                this.obj.setVelocityX(speed);
                if (!this.obj.anims.isPlaying || this.obj.anims.currentAnim.key !== `${spriteSheet}right`) {
                    this.obj.anims.play(`${spriteSheet}right`, true);
                }
                break;
            case "up":
                this.obj.setVelocityY(-speed);
                if (!this.obj.anims.isPlaying || this.obj.anims.currentAnim.key !== `${spriteSheet}up`) {
                    this.obj.anims.play(`${spriteSheet}up`, true);
                }
                break;
            case "down":
                this.obj.setVelocityY(speed);
                if (!this.obj.anims.isPlaying || this.obj.anims.currentAnim.key !== `${spriteSheet}down`) {
                    this.obj.anims.play(`${spriteSheet}down`, true);
                }
                break;
            default:
                if (this.obj.anims.isPlaying) {
                    this.obj.anims.stop();
                    const currentAnimKey = this.obj.anims.currentAnim ? this.obj.anims.currentAnim.key : '';
                    if (currentAnimKey) {
                        this.obj.anims.play(currentAnimKey.replace('Run', 'Walk'), false);
                    }
                }
                break;
        }
    }

    moveTo(arrivalPos, spriteSheet, running) {
        if (running === undefined) running = false;
        const vect = {
            x: arrivalPos.x - this.obj.x,
            y: arrivalPos.y - this.obj.y
        }
        const direction = {
            x: Math.sign(vect.x),
            y: Math.sign(vect.y)
        };

        let strDirection;
        if (direction.x === 1) strDirection = "right";
        else if (direction.x === -1) strDirection = "left";
        else if (direction.y === 1) strDirection = "down";
        else if (direction.y === -1) strDirection = "up";

        const interval = setInterval(() => {
            const distance = Math.sqrt((arrivalPos.x - this.obj.x)**2 + (arrivalPos.y - this.obj.y)**2);
            if (distance <= 0.3) {
                this.move('', spriteSheet);
                this.obj.anims.stop();
                const anim = this.scene.anims.get(`${spriteSheet}${strDirection}`);
                if (anim) this.obj.setFrame(anim.frames[0].frame.name);
                this.obj.setPosition(arrivalPos.x, arrivalPos.y);
                clearInterval(interval);
            }
             else this.move(strDirection, spriteSheet, running?70:35);
        }, 10);
    }    

    setPosition(x, y) {
        this.obj.setPosition(x, y);
    }
}
