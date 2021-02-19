import { isNewProjectAction } from "@/actions/project-new";

import { createNodeGraphReducer } from "../utils";
import { defaultNodeGraphServiceState } from "../state";

export default createNodeGraphReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultNodeGraphServiceState;
});
