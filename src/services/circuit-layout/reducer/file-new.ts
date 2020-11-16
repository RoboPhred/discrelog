import { isNewFileAction } from "@/actions/file-new";

import { createCircuitLayoutReducer } from "../utils";
import { defaultCircuitLayoutState } from "../state";

export default createCircuitLayoutReducer((state, action) => {
  if (!isNewFileAction(action)) {
    return state;
  }

  return defaultCircuitLayoutState;
});
