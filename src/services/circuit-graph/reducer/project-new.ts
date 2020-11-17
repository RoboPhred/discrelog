import { isNewProjectAction } from "@/actions/project-new";

import { createCircuitGraphReducer } from "../utils";
import { defaultCircuitGraphState } from "../state";

export default createCircuitGraphReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultCircuitGraphState;
});
