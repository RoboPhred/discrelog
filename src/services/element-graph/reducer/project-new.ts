import { isNewProjectAction } from "@/actions/project-new";

import { createElementGraphReducer } from "../utils";
import { defaultElementGraphServiceState } from "../state";

export default createElementGraphReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultElementGraphServiceState;
});
