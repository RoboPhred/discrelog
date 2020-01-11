import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { isFastForwardSimAction } from "@/actions/sim-fastforward";
import { tickSim } from "@/actions/sim-tick";

import evolveSimReducer from "./sim-evolve";

export default function simFastForwardReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFastForwardSimAction(action)) {
    return state;
  }

  const { tick, transitionWindows } = state.services.simulator;

  if (transitionWindows.length === 0) {
    return state;
  }

  const nextWindowTick = transitionWindows[0].tick - tick;
  return evolveSimReducer(state, tickSim(nextWindowTick));
}
