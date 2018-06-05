import { keyboardCtrlMeta } from "@/runtime-env";

export const KEYMAP_STEPSIM = "keymap:CircuitEditor/SimStep" as "keymap:CircuitEditor/SimStep";

export default {
  [KEYMAP_STEPSIM]: "space"
};

export type KeymapKeys = typeof KEYMAP_STEPSIM;
export type KeymapHandler = Record<KeymapKeys, HotkeyHandler>;
