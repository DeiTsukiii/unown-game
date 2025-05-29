import { steps } from "../scenes/steps/steps.js";
import { ressources } from "./ressources.js";

export function nextStep(scene) {
    const data = ressources.getData();
    data.step++;
    ressources.saveData(data);
    scene.scene.stop();
    scene.scene.start(steps[data.step]);
}

export function loadStep(scene) {
    const data = ressources.getData();
    scene.scene.stop();
    scene.scene.start(steps[data.step]);
}