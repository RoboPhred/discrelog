import { isPauseSimAction } from "@/actions/sim-pause";

import { createSimulatorReducer } from "../utils";
import { isSimActiveSelector } from "../selectors/run";

export default createSimulatorReducer((state, action) => {
  if (!isPauseSimAction(action)) {
    return state;
  }

  const { mode } = action.payload;

  if (!isSimActiveSelector.local(state)) {
    return state;
  }

  let runMode = state.mode;

  switch (mode) {
    case true:
      runMode = "pause";
      break;
    case false:
      runMode = "run";
      break;
    case "toggle":
      runMode = runMode == "run" ? "pause" : "run";
  }

  return {
    ...state,
    mode: runMode,
  };
});
