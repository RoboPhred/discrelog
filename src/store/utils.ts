import { Reducer, AnyAction } from "redux";

export interface EnhancedReducer<TState, TArgs> {
  (state: TState | undefined, action: AnyAction, ...args: TArgs[]): TState;
}

export function combineReducers<TState, TArgs>(
  ...reducers: EnhancedReducer<TState, TArgs>[]
): EnhancedReducer<TState, TArgs> {
  return (state: TState | undefined, action: AnyAction) => {
    return reducers.reduce<TState>(
      (state, reducer) => reducer(state, action),
      state as any
    );
  };
}
