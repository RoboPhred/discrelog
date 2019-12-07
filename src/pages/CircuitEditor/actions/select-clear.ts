import { AnyAction } from "redux";

export const ACTION_SELECT_CLEAR = "@editor/select/clear" as "@editor/select/clear";
export const clearSelection = () => ({
  type: ACTION_SELECT_CLEAR
});
export type ClearSelectionAction = ReturnType<typeof clearSelection>;
export function isClearSelectionAction(
  action: AnyAction
): action is ClearSelectionAction {
  return action.type === ACTION_SELECT_CLEAR;
}
