import { AnyAction } from "redux";

import {
  SimulatorState,
  defaultSimulatorState
} from "@/services/simulator/state";

import evolveSimReducer from "./sim-evolve";
import { isFastForwardSimAction } from "../actions/sim-fastforward";
import { evolveSim } from "../actions/sim-evolve";

export default function fastForwardSimReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  if (!isFastForwardSimAction(action)) {
    return state;
  }

  const { tick, transitionWindows } = state;

  if (transitionWindows.length === 0) {
    return state;
  }

  const nextWindowTick = transitionWindows[0].tick - tick;
  return evolveSimReducer(state, evolveSim(nextWindowTick));
}
