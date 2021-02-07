import { isStopSimAction } from "@/actions/sim-stop";

import { createSimulatorGraphReducer } from "../utils";

import { defaultSimulatorGraphState } from "../state";

export default createSimulatorGraphReducer((state, action) => {
  if (!isStopSimAction(action)) {
    return state;
  }

  // Reset the simulator but keep the ticks per second choice.
  return {
    ...defaultSimulatorGraphState,
  };
});
