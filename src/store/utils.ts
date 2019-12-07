import { AnyAction } from "redux";

import { AppState } from "./state";

export interface EnhancedReducer<TState> {
  (state: TState | undefined, action: AnyAction, appState: AppState): TState;
}

export function combineReducers<TState>(
  ...reducers: EnhancedReducer<TState>[]
): EnhancedReducer<TState> {
  return (state: TState | undefined, action: AnyAction, appState: AppState) => {
    return reducers.reduce<TState>(
      (state, reducer) => reducer(state, action, appState),
      state as any
    );
  };
}
