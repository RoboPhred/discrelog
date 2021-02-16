import { AnyAction } from "redux";

export const ACTION_SELECTION_COPY = "@selection/copy" as const;
export const copySelection = () => ({
  type: ACTION_SELECTION_COPY,
});
export type CopySelectionAction = ReturnType<typeof copySelection>;
export function isCopySelectionAction(
  action: AnyAction
): action is CopySelectionAction {
  return action.type === ACTION_SELECTION_COPY;
}
