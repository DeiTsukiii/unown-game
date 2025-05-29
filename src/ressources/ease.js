function verifyBlackScreen(scene) {
    if (!scene.blackScreen) scene.blackScreen = scene.add.rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0).setDepth(9999);
}

export function easeIn(scene, onComplete) {
    verifyBlackScreen(scene);
    if (onComplete === undefined) onComplete = () => {};
    scene.blackScreen.setAlpha(1); 
    scene.tweens.add({targets: scene.blackScreen, alpha: 0, duration: 600, onComplete: onComplete});
}

export function easeOut(scene, onComplete) {
    verifyBlackScreen(scene);
    if (onComplete === undefined) onComplete = () => {};
    scene.blackScreen.setAlpha(0);
    scene.tweens.add({targets: scene.blackScreen, alpha: 1, duration: 600, onComplete: onComplete});
}