import { isNewFileAction } from "@/actions/file-new";

import { createGraphReducer } from "../utils";
import { defaultGraphState } from "../state";

export default createGraphReducer((state, action) => {
  if (!isNewFileAction(action)) {
    return state;
  }

  return defaultGraphState;
});
