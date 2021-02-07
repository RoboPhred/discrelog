import { AppReducer } from "./types";

export const PRIORITY_PRE = -10;
export const PRIORITY_POST = 10;
export const PRIORITY_SAVE = 50;

export function reducerPriority(
  priority: number,
  reducer: AppReducer
): AppReducer {
  reducer.weight = priority;
  return reducer;
}

export function priorityBefore(reducer: AppReducer) {
  return (reducer.weight ?? 0) - 1;
}
