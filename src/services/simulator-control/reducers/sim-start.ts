import { isStartSimAction } from "@/actions/sim-start";

import { createSimulatorControlReducer } from "../utils";

export default createSimulatorControlReducer((state, action) => {
  if (!isStartSimAction(action)) {
    return state;
  }

  return {
    ...state,
    mode: "run",
  };
});
