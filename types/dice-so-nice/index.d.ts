import type { HexColorString } from "../foundry/common/constants.mjs";

export type DiceMaterial = "chrome" | "glass" | "iridescent" | "metal" | "plastic" | "pristine" | "stone" | "wood";
export type DiceString = "d2" | "d3" | "d4" | "d5" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100" | "df";

export interface Dice3D {
    addColorset: (options: DiceColorsetOptions, mode?: "default" | "preferred") => void;
    addDicePreset: (data: DicePresetOptions, shape?: null | string) => void;
    addSystem: (system: {
        colorset?: string;
        group?: string;
        id: string;
        mode?: "default" | "preferred";
        name: string;
    }) => void;
    addTexture: (
        textureId: string,
        options: {
            bump?: string;
            composite: string;
            name: string;
            source: string;
        },
    ) => Promise<void>;
}

export interface DiceColorsetOptions {
    /*
     * A string ID for the colorset
     */
    name: string;

    description: string; // Localized string for settings
    background?: HexColorString; // Colors of the dice
    category: string; // Used to group the colorsets in the settings
    edge?: "none" | HexColorString; // Colors of the edges. Can be 'none'.
    font?: string; // is the name of the font family. This can be a Webfont too. (ex: Arial, monospace, etc)
    fontScale?: Record<DiceString, number>; // is an object containing the fontScale for as many dice types as wanted.Here bellow is the default scale applied when a dice type is omitted.
    foreground?: HexColorString; // Colors of the labels
    material?: DiceMaterial; // ID of the material to use if "Auto (Theme)" is selected in the settings. Supported values are plastic, metal, glass, wood, pristine, iridescent and chrome
    outline?: "none" | HexColorString; // Colors of the label outline. Can be 'none'.
    texture?: string | string[]; // An array of ID, or a single ID of the texture to use if "None / Auto (Theme)" is selected in the settings. If it is a custom texture, make sure to call this function after the Promise from "addTexture" is resolved.
    visibility?: "hidden" | "visible"; // Set to 'hidden' if you do not want this colorset to be visible in the players' theme list. Useful for internal colorsets.
}

export interface DicePresetOptions {
    type: string;
    bumpMaps?: (string | undefined)[];
    colorset?: string;
    labels: string[];
    modelFile?: string;
    system: string;
}

export interface DicePreset {
    fixme: never;
}

declare module "@client/helpers/hooks.mjs" {
    interface AllHooks {
        diceSoNiceInit: (dice3d: Dice3D) => CancellableHookReturn;
        diceSoNiceReady: (dice3d: Dice3D) => CancellableHookReturn;
        diceSoNiceMessageProcessed: (messageId: string, interception: { willTrigger3DRoll: boolean }) => HookReturn;
        diceSoNiceRollStart: (
            messageId: string,
            context: { roll: Roll; user: User; users: User[] | null; blind: boolean },
        ) => HookReturn;
        diceSoNiceRollComplete: (messageId: string) => HookReturn;
        diceSoNiceModelLoaded: (preset: DicePreset) => HookReturn;
    }
}

declare module "pf2e-types" {
    interface GamePF2e {
        dice3d?: {
            waitFor3DAnimationByMessageID(messageId: string): Promise<boolean>;
        };
    }
}
