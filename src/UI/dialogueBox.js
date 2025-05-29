import { ressources } from "../ressources/ressources.js";

export default class DialogueBox {
    constructor(scene, dialogue, canSkip, fix, key, responses, input) {
        this.scene = scene;
        this.canSkip = canSkip;
        this.dialogue = ressources.getLanguage().steps[dialogue[0]][dialogue[1]];
        this.dialogue = this.dialogue.map(line => {
            if (dialogue[2]) { 
                for (const key in dialogue[2]) {
                    line = line.replace(new RegExp(`{${key}}`, "g"), dialogue[2][key]);
                }
            }
            return line;
        });

        this.fix = fix;
        this.key = key;
        this.responses = responses;
        this.input = input;

        this.dialogueBox = this.scene.add.image(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 420, 'dialogueBox').setScale(5);
        this.cursorPosition = [this.scene.cameras.main.centerX * 1.89, this.scene.cameras.main.centerY + 450];
        this.dialogueCursor = this.scene.add.image(this.cursorPosition[0], this.cursorPosition[1], 'dialogueCursor').setScale(3);
        if (!this.canSkip || this.fix) this.dialogueCursor.setVisible(false);
        this.animCursor();

        this.pages = this.formatDialogue(this.dialogue);
        this.currentPage = 0;

        this.text = this.scene.add.text(80, 920, "", {
            font: '30px PressStart2P',
            fill: '#979571',
            lineSpacing: 15
        }).setOrigin(0, 0);

        if (!this.input) this.animateText(this.pages[this.currentPage]);

        if (this.input) {
            const keys = [];
            const valid = function () {
                const inputText = keys.join('');
                this.scene.events.emit(`inputComplete-${key}`, inputText);
            };            
            const setText = function() {
                const text = keys.join('');
                const textWithDashes = text + '_'.repeat(Math.max(0, 10 - text.length));
                this.text.setText(`${this.dialogue}${textWithDashes}`);
            };
        
            setText.call(this);
        
            this.scene.input.keyboard.on('keydown', event => {
                if (event.key === 'Enter' || (event.key.match(/^[a-zA-Z]$/) && keys.length < 10) || (event.key === 'Backspace' && keys.length > 0)) this.scene.sound.play('keyPress', { loop: false, volume: 0.5 });
                if (event.key === 'Enter') valid.call(this);
                else if (event.key.match(/^[a-zA-Z]$/) && keys.length < 10) keys.push(event.key);
                else if (event.key === 'Backspace' && keys.length > 0) keys.pop();
                setText.call(this);
            });
        
            this.validButton = this.scene.add.image(this.cursorPosition[0], this.cursorPosition[1] + 5, 'validButton')
                .setOrigin(1, 1)
                .setScale(5)
                .setInteractive();
        
            this.validButton.on('pointerdown', () => {
                this.scene.sound.play('buttonClick', { loop: false, volume: 0.5 });
                this.validButton.setTexture('validButtonPressed');
                this.scene.time.delayedCall(200, () => {
                    this.validButton.setTexture('validButton');
                });
                valid.call(this);
            });
        }

        if (this.responses) {
            const responses = ressources.getLanguage().responses;
            this.yesButton = this.dialogueBox = this.scene.add.image(1670, 700, 'toggleButton').setScale(5).setInteractive().setVisible(false);
            const yes = this.scene.add.text(1673, 700, responses.yes, {
                font: '35px PressStart2P',
                fill: '#979571',
                lineSpacing: 15
            }).setOrigin(0.5).setVisible(false);

            this.noButton = this.dialogueBox = this.scene.add.image(1670, 800, 'toggleButton').setScale(5).setInteractive().setVisible(false);
            const no = this.scene.add.text(1673, 800, responses.no, {
                font: '35px PressStart2P',
                fill: '#979571',
                lineSpacing: 15
            }).setOrigin(0.5).setVisible(false);

            this.scene.events.once('dialogueTypingFinish', () => {
                this.yesButton.setVisible(true);
                this.noButton.setVisible(true);
                yes.setVisible(true);
                no.setVisible(true);
            });

            const invisible = function () {
                this.scene.sound.play('dialoguePass', { loop: false, volume: 0.5 });
            
                this.scene.tweens.add({
                    targets: [this.yesButton, this.noButton, yes, no],
                    alpha: 0,
                    duration: 300,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        this.yesButton.setVisible(false);
                        this.noButton.setVisible(false);
                        yes.setVisible(false);
                        no.setVisible(false);
                    }
                });
            };

            this.yesButton.on('pointerdown', () => {
                this.scene.events.emit(`yesChoiced-${this.key}`);
                invisible.call(this);
            });
            this.noButton.on('pointerdown', () => {
                this.scene.events.emit(`noChoiced-${this.key}`);
                invisible.call(this);
            });
        }
    }

    formatDialogue(dialogueArray) {
        let pages = [];
        const maxLengths = [54, 53];

        dialogueArray.forEach(dialogue => {
            let words = dialogue.split(" ");
            let lines = [];
            let currentLine = "";
            let currentLengthIndex = 0;

            words.forEach(word => {
                if ((currentLine + " " + word).trim().length <= maxLengths[currentLengthIndex]) {
                    currentLine = (currentLine + " " + word).trim();
                } else {
                    lines.push(currentLine);
                    currentLengthIndex = (currentLengthIndex + 1) % 2;
                    currentLine = word;
                }
            });

            if (currentLine) {
                lines.push(currentLine);
            }

            for (let i = 0; i < lines.length; i += 2) {
                pages.push(lines.slice(i, i + 2).join("\n"));
            }
        });

        return pages;
    }

    animateText(fullText) {
        this.text.setText("");
        let currentText = "";
        let index = 0;

        const speed = ressources.getData().settings["Fast text\nflow"] ? 5 : 20;
        this.textInterval = setInterval(() => {
            this.scene.events.emit('dialogueTypingStart');
            if (index < fullText.length) {
                currentText += fullText[index];
                this.text.setText(currentText);
                index++;
            } else {
                clearInterval(this.textInterval);
                this.scene.events.emit('dialogueTypingFinish');
                if (!this.canSkip && !this.fix) this.dialogueCursor.setVisible(true);
            }
        }, speed);
    }

    nextPage(playSound) {
        if (this.canSkip || this.text.text === this.pages[this.currentPage]) {
            clearInterval(this.textInterval);
            if (this.currentPage < this.pages.length - 1) {
                if (playSound) this.scene.sound.play('dialoguePass', { loop: false, volume: 0.5 });
                this.currentPage++;
                this.animateText(this.pages[this.currentPage]);
                if (!this.canSkip) this.dialogueCursor.setVisible(false);
            } else {
                this.scene.events.emit('dialogueComplete');
                if (this.key !== undefined) this.scene.events.emit(`dialogueComplete-${this.key}`);
                if (playSound) this.scene.sound.play('dialoguePass', { loop: false, volume: 0.5 });
            }
        }
    }

    animCursor() {
        this.cursorInterval = setInterval(() => {
            if (this.cursorPosition[1] < this.dialogueCursor.y) {
                this.dialogueCursor.y -= 10;
            } else {
                this.dialogueCursor.y += 10;
            }
        }, 500);
    }
}