import { keyboardCommandModifier } from "@/runtime-env";

export const KEYMAP_SIM_STEP = "keymap:CircuitEditor/SimStep" as const;
export const KEYMAP_SIM_FASTFORWARD = "keymap:CircuitEditor/SimFastForward" as const;
export const KEYMAP_NODE_COPY = "keymap:CircuitEditor/Copy" as const;
export const KEYMAP_NODE_PASTE = "keymap:CircuitEditor/Paste" as const;
export const KEYMAP_NODE_DELETE = "keymap:CircuitEditor/Delete" as const;

const keymap = {
  [KEYMAP_SIM_STEP]: "space",
  [KEYMAP_SIM_FASTFORWARD]: "shift+space",
  [KEYMAP_NODE_COPY]: `${keyboardCommandModifier}+c`,
  [KEYMAP_NODE_PASTE]: `${keyboardCommandModifier}+v`,
  [KEYMAP_NODE_DELETE]: ["backspace", "del"]
};
export default keymap;

export type KeymapKeys = keyof typeof keymap;
export type KeymapHandler = Record<KeymapKeys, HotkeyHandler>;
