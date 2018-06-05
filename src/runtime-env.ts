import { os } from "platform";

const OS_MAC = /(Mac|iOS|OS\ X)/;

export const keyboardCommandCtrl = OS_MAC.test((os || "unknown").toString())
  ? "command"
  : "ctrl";
