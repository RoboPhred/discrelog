import { AnyAction } from "redux";

export const ACTION_PROJECT_NEW = "@project/new" as const;
export const newProject = () => ({
  type: ACTION_PROJECT_NEW,
});
export type NewProjectAction = ReturnType<typeof newProject>;
export function isNewProjectAction(
  action: AnyAction
): action is NewProjectAction {
  return action.type === ACTION_PROJECT_NEW;
}
