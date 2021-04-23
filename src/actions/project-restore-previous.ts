import { AnyAction } from "redux";

export const ACTION_PROJECT_RESTORE_PREVIOUS = "@project/restore-previous" as const;
export const restorePreviousProject = () => ({
  type: ACTION_PROJECT_RESTORE_PREVIOUS,
});
export type RestorePreviousProjectAction = ReturnType<
  typeof restorePreviousProject
>;
export function isRestorePreviousProjectAction(
  action: AnyAction
): action is RestorePreviousProjectAction {
  return action.type === ACTION_PROJECT_RESTORE_PREVIOUS;
}
