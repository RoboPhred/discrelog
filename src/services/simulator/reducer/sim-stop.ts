import { isStopSimAction } from "@/actions/sim-stop";

import { defaultSimulatorServiceState } from "../state";

import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action) => {
  if (!isStopSimAction(action)) {
    return state;
  }

  return defaultSimulatorServiceState;
});
