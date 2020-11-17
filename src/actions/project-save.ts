import { AnyAction } from "redux";

export const ACTION_PROJECT_SAVE = "@project/save" as const;
export const saveProject = () => ({
  type: ACTION_PROJECT_SAVE,
});
export type SaveProjectAction = ReturnType<typeof saveProject>;
export function isSaveProjectAction(
  action: AnyAction
): action is SaveProjectAction {
  return action.type === ACTION_PROJECT_SAVE;
}
