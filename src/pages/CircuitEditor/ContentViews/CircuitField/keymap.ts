export const KEYMAP_SIM_STEP = "keymap:CircuitEditor/SimStep" as "keymap:CircuitEditor/SimStep";
export const KEYMAP_SIM_FASTFORWARD = "keymap:CircuitEditor/SimFastForward" as "keymap:CircuitEditor/SimFastForward";

const keymap = {
  [KEYMAP_SIM_STEP]: "space",
  [KEYMAP_SIM_FASTFORWARD]: "shift+space"
};
export default keymap;

export type KeymapKeys = keyof typeof keymap;
export type KeymapHandler = Record<KeymapKeys, HotkeyHandler>;
