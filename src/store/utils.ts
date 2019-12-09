import { AnyAction, Reducer } from "redux";
import { AppState } from "./state";

export function combineReducers(
  ...reducers: Reducer<AppState, AnyAction>[]
): Reducer<AppState, AnyAction> {
  return (state: AppState | undefined, action: AnyAction) => {
    return reducers.reduce<AppState>(
      (state, reducer) => reducer(state, action),
      state as any
    );
  };
}
