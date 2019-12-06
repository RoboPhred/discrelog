import { Reducer, AnyAction } from "redux";

export function combineReducers<TState>(
  ...reducers: Reducer<TState>[]
): Reducer<TState> {
  return (state: TState | undefined, action: AnyAction) => {
    return reducers.reduce<TState>(
      (state, reducer) => reducer(state, action),
      state as any
    );
  };
}
