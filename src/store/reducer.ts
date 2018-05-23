import { Action, combineReducers, AnyAction } from "redux";

import simulatorReducer from "@/services/simulator/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { AppState, defaultAppState } from "./state";

export default function appStateReducer(
  state: AppState = defaultAppState,
  // AnyAction does not work here, as typescript is being far too strict.
  //  AnyAction is defined as {[key: string]: any}, which it claims cannot be converted to {payload: any}
  action: any
) {
  return {
    services: {
      simulator: simulatorReducer(state.services.simulator, action)
    },
    ui: {
      circuitEditor: circuitEditorReducer(state.ui.circuitEditor, action, state)
    }
  };
}
