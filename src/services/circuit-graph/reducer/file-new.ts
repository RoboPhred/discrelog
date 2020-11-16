import { isNewFileAction } from "@/actions/file-new";

import { createCircuitGraphReducer } from "../utils";
import { defaultCircuitGraphState } from "../state";

export default createCircuitGraphReducer((state, action) => {
  if (!isNewFileAction(action)) {
    return state;
  }

  return defaultCircuitGraphState;
});
