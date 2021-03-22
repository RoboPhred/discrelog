import { isProjectMutationAction } from "@/project-mutation-actions";

import { defaultSimulatorServiceState } from "../state";
import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action) => {
  if (!isProjectMutationAction(action)) {
    return state;
  }

  return defaultSimulatorServiceState;
});
