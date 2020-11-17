import { isNewProjectAction } from "@/actions/project-new";

import { createSelectionReducer } from "../utils";
import { defaultSelectionState } from "../state";

export default createSelectionReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultSelectionState;
});
