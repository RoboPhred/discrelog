import { isNewFileAction } from "@/actions/file-new";

import { createFieldReducer } from "../utils";
import { defaultFieldState } from "../state";

export default createFieldReducer((state, action) => {
  if (!isNewFileAction(action)) {
    return state;
  }

  return defaultFieldState;
});
