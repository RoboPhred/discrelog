import { isProjectMutationAction } from "@/project-mutation-actions";

import { createSimulatorControlReducer } from "../utils";

export default createSimulatorControlReducer((state, action) => {
  if (!isProjectMutationAction(action)) {
    return state;
  }

  return {
    ...state,
    mode: "edit",
  };
});
