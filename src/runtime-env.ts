import { os } from "platform";

const OS_MAC = /(Mac|iOS|OS\ X)/;

export const keyboardIsMac = OS_MAC.test((os || "undefined").toString());

export const keyboardCommandModifier = keyboardIsMac ? "command" : "ctrl";

export const rootUrl = `${window.location.host}/${__webpack_public_path__}`;
