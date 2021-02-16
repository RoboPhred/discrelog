import { AnyAction } from "redux";

export const ACTION_SELECTION_DELETE = "@selection/delete" as const;
export const deleteSelection = () => ({
  type: ACTION_SELECTION_DELETE,
});
export type DeleteSelectionAction = ReturnType<typeof deleteSelection>;
export function isDeleteSelectionAction(
  action: AnyAction
): action is DeleteSelectionAction {
  return action.type === ACTION_SELECTION_DELETE;
}
