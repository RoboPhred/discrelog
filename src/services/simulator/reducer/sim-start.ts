import { isStartSimAction } from "@/actions/sim-start";

import { createSimulatorReducer } from "../utils";

import { simInit } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isStartSimAction(action)) {
    return state;
  }

  return simInit(state, appState);
});
