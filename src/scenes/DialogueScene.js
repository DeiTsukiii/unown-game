import DialogueBox from "../UI/dialogueBox.js";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueScene' });
    }

    init(data) {
        this.dialogue = data.dialogue;
        this.sc = data.scene;
        this.pause = data.pause !== undefined ? data.pause : true;
        this.canSkip = data.canSkip !== undefined ? data.canSkip : true;
        this.fix = data.fix !== undefined ? data.fix : false;
        this.key = data.key;
        this.responses = data.responses !== undefined ? data.responses : false;
        this.inp = data.input !== undefined ? data.input : false;
        if (this.inp) this.fix = true;
    }

    create() {
        if (this.pause) this.sc.scene.pause();
        this.dialogueBox = new DialogueBox(this, this.dialogue, this.canSkip, this.fix, this.key, this.responses, this.inp);

        this.input.on('pointerdown', () => {if (!this.fix) this.dialogueBox.nextPage(true)});

        this.events.once('dialogueComplete', () => {
            if (this.pause) this.sc.scene.resume();
            this.scene.stop();
        });
    }

    nextPage() {
        this.dialogueBox.nextPage(false);
    }
}