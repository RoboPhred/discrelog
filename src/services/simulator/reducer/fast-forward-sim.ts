import {
  SimulatorState,
  defaultSimulatorState
} from "@/services/simulator/state";
import { FastForwardSimAction, evolveSim } from "@/services/simulator/actions";

import evolveSimReducer from "./evolve-sim";

export default function fastForwardSimReducer(
  state: SimulatorState = defaultSimulatorState,
  action: FastForwardSimAction
): SimulatorState {
  const { tick, transitionWindows } = state;

  if (transitionWindows.length === 0) {
    return state;
  }

  const nextWindowTick = transitionWindows[0].tick - tick;
  return evolveSimReducer(state, evolveSim(nextWindowTick));
}
