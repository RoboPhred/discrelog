import { AnyAction } from "redux";

export const ACTION_REDO = "@undo/redo" as const;
export const redo = () => ({
  type: ACTION_REDO,
});
export function isRedoAction(action: AnyAction) {
  return action.type === ACTION_REDO;
}
