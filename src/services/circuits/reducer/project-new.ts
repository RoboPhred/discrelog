import { isNewProjectAction } from "@/actions/project-new";

import { ROOT_CIRCUIT_ID } from "../constants";
import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return {
    ...state,
    circuitNamesByCircuitId: {
      [ROOT_CIRCUIT_ID]: "Root",
    },
    elementIdsByCircuitId: {
      [ROOT_CIRCUIT_ID]: [],
    },
  };
});
