import { isFastForwardSimAction } from "@/actions/sim-fastforward";

import { createSimulatorReducer } from "../utils";

import { simTick } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isFastForwardSimAction(action)) {
    return state;
  }

  const { tick, transitionWindows } = state;

  if (transitionWindows.length === 0) {
    return state;
  }

  const nextWindowTick = transitionWindows[0].tick - tick;
  return simTick(state, nextWindowTick, appState);
});
