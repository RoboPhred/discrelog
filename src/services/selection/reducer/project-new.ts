import { isNewProjectAction } from "@/actions/project-new";

import { createSelectionReducer } from "../utils";
import { defaultSelectionServiceState } from "../state";

export default createSelectionReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultSelectionServiceState;
});
