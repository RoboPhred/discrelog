import simulatorReducer from "@/services/simulator/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { AppState, defaultAppState } from "./state";
import { AnyAction } from "redux";

export default function appStateReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  state = simulatorReducer(state, action);
  state = circuitEditorReducer(state, action);
  return state;
}
