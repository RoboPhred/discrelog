import { AnyAction } from "redux";

export const ACTION_SELECTION_DELETE = "@selection/delete" as const;
export const selectionDelete = () => ({
  type: ACTION_SELECTION_DELETE
});
export type SelectionDeleteAction = ReturnType<typeof selectionDelete>;
export function isSelectionDeleteAction(
  action: AnyAction
): action is SelectionDeleteAction {
  return action.type === ACTION_SELECTION_DELETE;
}
