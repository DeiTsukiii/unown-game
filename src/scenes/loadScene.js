import BootScene from "./BootScene.js";
import DialogueScene from "./DialogueScene.js";
import MainMenu from "./MainMenu.js";
import MusicScene from "./MusicScene.js";
import PauseMenu from "./PauseMenu.js";
import SettingsMenu from "./SettingsMenu.js";

// Steps :
import { Oppening, Oppening2 }  from "./steps/[0] Oppening.js";


export const scenes = [
    BootScene,

    //Steps
    Oppening,
    Oppening2,

    // Menu
    MainMenu,
    PauseMenu,
    SettingsMenu,

    // Utils
    MusicScene,
    DialogueScene
]