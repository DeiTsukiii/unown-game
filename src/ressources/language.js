import { languages } from "../assets/language/languages.js";
import { getData } from "./data.js";

export function getLanguage() {
    const lng = getData().settings.language;
    
    return languages[lng];
}