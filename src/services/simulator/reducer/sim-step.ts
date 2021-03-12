import { AnyAction } from "redux";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isStepSimAction } from "@/actions/sim-step";
import { tickSim } from "@/actions/sim-tick";

import { simInit } from "./utils";

export default function (
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isStepSimAction(action)) {
    return state;
  }

  const { initialized } = state.services.simulator;
  if (!initialized) {
    state = fpSet(state, "services", "simulator", (simState) =>
      simInit(simState, state)
    );
  }

  // These may have changed as a result of the init process.
  const { tick, transitionWindows } = state.services.simulator;
  if (transitionWindows.length === 0) {
    return state;
  }

  const windowTick = transitionWindows[0].tick;

  return rootReducer(state, tickSim(windowTick - tick));
}
