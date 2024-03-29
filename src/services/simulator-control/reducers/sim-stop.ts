import { isStopSimAction } from "@/actions/sim-stop";

import { createSimulatorControlReducer } from "../utils";

import { defaultSimulatorControlServiceState } from "../state";

export default createSimulatorControlReducer((state, action) => {
  if (!isStopSimAction(action)) {
    return state;
  }

  // Reset the simulator but keep the ticks per second choice.
  return {
    ...defaultSimulatorControlServiceState,
    ticksPerSecond: state.ticksPerSecond,
  };
});
