import { AnyAction } from "redux";

export const ACTION_SELECT_CLEAR = "@select/all" as const;
export const selectAll = (circuitId: string) => ({
  type: ACTION_SELECT_CLEAR,
  payload: { circuitId },
});
export type SelectAllAction = ReturnType<typeof selectAll>;
export function isSelectAllAction(
  action: AnyAction
): action is SelectAllAction {
  return action.type === ACTION_SELECT_CLEAR;
}
