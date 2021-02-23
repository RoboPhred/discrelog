import { os } from "platform";

const OS_MAC = /(Mac|iOS|OS\ X)/;

export const keyboardIsMac = OS_MAC.test((os || "undefined").toString());

export const keyboardCommandModifier = keyboardIsMac ? "command" : "ctrl";

const rootUrlBuilder = new URL(window.location.host);
rootUrlBuilder.pathname = __webpack_public_path__;
export const rootUrl = rootUrlBuilder.toString();
