import { AnyAction, Reducer } from "redux";

import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import { CircuitFieldState } from "../state";

export interface CircuitFieldReducer {
  (state: CircuitFieldState, action: AnyAction): CircuitFieldState;
}

export function createFieldReducer(
  reducer: CircuitFieldReducer
): Reducer<AppState, AnyAction> {
  return (state: AppState = defaultAppState, action: AnyAction) => {
    const newState = reducer(state.ui.circuitEditor.circuitField, action);
    if (state.ui.circuitEditor.circuitField != newState) {
      return fpSet(state, "ui", "circuitEditor", "circuitField", newState);
    }
    return state;
  };
}
