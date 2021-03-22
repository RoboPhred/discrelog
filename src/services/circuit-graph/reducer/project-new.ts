import { isNewProjectAction } from "@/actions/project-new";

import { createCircuitGraphReducer } from "../utils";
import { defaultCircuitGraphServiceState } from "../state";

export default createCircuitGraphReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultCircuitGraphServiceState;
});
