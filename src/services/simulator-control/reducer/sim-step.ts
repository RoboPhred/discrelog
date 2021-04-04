import { isStepSimAction } from "@/actions/sim-step";

import { createSimulatorControlReducer } from "../utils";

export default createSimulatorControlReducer((state, action) => {
  if (!isStepSimAction(action)) {
    return state;
  }

  return {
    ...state,
    mode: "pause",
  };
});
