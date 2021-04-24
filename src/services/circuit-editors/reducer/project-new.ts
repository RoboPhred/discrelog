import { isNewProjectAction } from "@/actions/project-new";

import { createCircuitEditorsReducer } from "../utils";
import { defaultCircuitEditorServiceState } from "../state";

export default createCircuitEditorsReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultCircuitEditorServiceState;
});
