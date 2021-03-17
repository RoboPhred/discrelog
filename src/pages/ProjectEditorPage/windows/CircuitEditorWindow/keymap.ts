import { keyboardCommandModifier } from "@/runtime-env";

export const KEYMAP_SIM_STEP = "keymap:CircuitEditor/SimStep" as const;
export const KEYMAP_SELECT_ALL = "keymap:CircuitEditor/SelectAll" as const;
export const KEYMAP_COPY = "keymap:CircuitEditor/Copy" as const;
export const KEYMAP_PASTE = "keymap:CircuitEditor/Paste" as const;
export const KEYMAP_DELETE = "keymap:CircuitEditor/Delete" as const;
export const KEYMAP_UNDO = "keymap:CircuitEditor/Undo" as const;
export const KEYMAP_REDO = "keymap:CircuitEditor/Redo" as const;

const keymap = {
  [KEYMAP_SIM_STEP]: "space",
  [KEYMAP_SELECT_ALL]: `${keyboardCommandModifier}+a`,
  [KEYMAP_COPY]: `${keyboardCommandModifier}+c`,
  [KEYMAP_PASTE]: `${keyboardCommandModifier}+v`,
  [KEYMAP_DELETE]: ["backspace", "del"],
  [KEYMAP_UNDO]: `${keyboardCommandModifier}+z`,
  [KEYMAP_REDO]: [
    `${keyboardCommandModifier}+y`,
    `${keyboardCommandModifier}+shift+z`,
  ],
};
export default keymap;

export type KeymapKeys = keyof typeof keymap;
export type KeymapHandler = Record<KeymapKeys, HotkeyHandler>;
