import { isTickSimAction } from "@/actions/sim-tick";

import { createSimulatorReducer } from "../utils";

import { simTick } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isTickSimAction(action)) {
    return state;
  }

  const { tickCount } = action.payload;

  const start = performance.now();

  state = simTick(state, tickCount, appState);

  const end = performance.now();

  const updateTime = end - start;
  state = {
    ...state,
    lastTickProcessingTimeMs: updateTime,
  };

  return state;
});
