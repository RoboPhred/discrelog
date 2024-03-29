import { isNewProjectAction } from "@/actions/project-new";

import { createCircuitLayoutReducer } from "../utils";
import { defaultCircuitLayoutServiceState } from "../state";

export default createCircuitLayoutReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultCircuitLayoutServiceState;
});
