import { isNewProjectAction } from "@/actions/project-new";

import { ROOT_CIRCUIT_ID } from "../../circuits/constants";
import { createCircuitPropertiesReducer } from "../utils";

export default createCircuitPropertiesReducer((state, action) => {
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
