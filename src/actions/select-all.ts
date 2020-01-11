import { AnyAction } from "redux";

export const ACTION_SELECT_CLEAR = "@select/all" as const;
export const selectAll = () => ({
  type: ACTION_SELECT_CLEAR
});
export type SelectAllAction = ReturnType<typeof selectAll>;
export function isSelectAllAction(
  action: AnyAction
): action is SelectAllAction {
  return action.type === ACTION_SELECT_CLEAR;
}
