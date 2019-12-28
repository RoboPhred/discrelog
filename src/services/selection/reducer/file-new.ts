import { isNewFileAction } from "@/actions/file-new";

import { createSelectionReducer } from "../utils";
import { defaultSelectionState } from "../state";

export default createSelectionReducer((state, action) => {
  if (!isNewFileAction(action)) {
    return state;
  }

  return defaultSelectionState;
});
