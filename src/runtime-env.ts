import { os } from "platform";

const OS_MAC = /(Mac|iOS|OS\ X)/;

export const keyboardIsMac = OS_MAC.test((os || "undefined").toString());

export const keyboardCtrlMeta = keyboardIsMac ? "command" : "ctrl";
