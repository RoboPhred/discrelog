import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { isFastForwardSimAction } from "@/actions/sim-fastforward";
import { evolveSim } from "@/actions/sim-evolve";

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
  return evolveSimReducer(state, evolveSim(nextWindowTick));
}
