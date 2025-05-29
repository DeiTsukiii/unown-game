import { getData, saveData } from "./data.js";
import { easeIn, easeOut } from "./ease.js";
import { getLanguage } from "./language.js";
import { loadStep, nextStep } from "./steps.js";

export const ressources = {
    getData: getData,
    saveData: saveData,
    nextStep: nextStep,
    loadStep: loadStep,
    getLanguage: getLanguage,
    easeIn: easeIn,
    easeOut: easeOut
}