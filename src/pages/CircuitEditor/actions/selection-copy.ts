import { AnyAction } from "redux";

export const ACTION_SELECTION_COPY = "@editor/selection/copy" as const;
export const selectionCopy = () => ({
  type: ACTION_SELECTION_COPY
});
export type SelectionCopyAction = ReturnType<typeof selectionCopy>;
export function isSelectionCopyAction(
  action: AnyAction
): action is SelectionCopyAction {
  return action.type === ACTION_SELECTION_COPY;
}
