import { isStopSimAction } from "@/actions/sim-stop";

import { createSimulatorReducer } from "../utils";

import { defaultSimulatorState } from "../state";

export default createSimulatorReducer((state, action, appState) => {
  if (!isStopSimAction(action)) {
    return state;
  }

  // Reset the simulator but keep the ticks per second choice.
  return {
    ...defaultSimulatorState,
    ticksPerSecond: state.ticksPerSecond,
  };
});
