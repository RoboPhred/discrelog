import { AnyAction, Reducer } from "redux";

import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import { FieldState } from "./state";

export interface FieldReducer {
  (state: FieldState, action: AnyAction): FieldState;
}

export function createFieldReducer(
  reducer: FieldReducer
): Reducer<AppState, AnyAction> {
  return (state: AppState = defaultAppState, action: AnyAction) => {
    const newState = reducer(state.services.field, action);
    if (state.services.field != newState) {
      return fpSet(state, "services", "field", newState);
    }
    return state;
  };
}

export interface FieldSelectorA0<TReturn> {
  (s: AppState): TReturn;
  local(s: FieldState): TReturn;
}

export interface FieldSelectorA1<TA1, TReturn> {
  (s: AppState, a1: TA1): TReturn;
  local(s: FieldState, a1: TA1): TReturn;
}

const fieldStateSelector = (s: AppState) => s.services.field;
export function createFieldSelector<TReturn>(
  selector: (s: FieldState) => TReturn
): FieldSelectorA0<TReturn>;
export function createFieldSelector<TA1, TReturn>(
  selector: (s: FieldState, a1: TA1) => TReturn
): FieldSelectorA1<TA1, TReturn>;
export function createFieldSelector<TArgs, TReturn>(
  selector: (s: FieldState, ...args: TArgs[]) => TReturn
): FieldSelectorA1<TArgs, TReturn> {
  const appSelector: any = (s: AppState, ...args: TArgs[]) =>
    selector(fieldStateSelector(s), ...args);
  appSelector.local = selector;
  return appSelector;
}
