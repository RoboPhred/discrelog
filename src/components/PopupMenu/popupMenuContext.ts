import * as React from "react";

export interface PopupMenuContext {
  onClose(): void;
}
export default React.createContext<PopupMenuContext>({
  onClose: () => {}
});
