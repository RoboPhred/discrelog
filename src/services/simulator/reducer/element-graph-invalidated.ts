import { isProjectMutationAction } from "@/project-mutation-actions";

import { defaultSimulatorState } from "../state";
import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action) => {
  if (!isProjectMutationAction(action)) {
    return state;
  }

  return defaultSimulatorState;
});
