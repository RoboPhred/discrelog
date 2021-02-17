import { AnyAction } from "redux";

export const ACTION_UNDO = "@undo/undo" as const;
export const undo = () => ({
  type: ACTION_UNDO,
});
export function isUndoAction(action: AnyAction) {
  return action.type === ACTION_UNDO;
}
