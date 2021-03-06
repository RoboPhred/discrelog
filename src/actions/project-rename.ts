import { AnyAction } from "redux";

export const ACTION_PROJECT_RENAME = "@project/rename" as const;
export const renameProject = (projectName: string) => ({
  type: ACTION_PROJECT_RENAME,
  payload: { projectName },
});
export type RenameProjectAction = ReturnType<typeof renameProject>;
export function isRenameProjectAction(
  action: AnyAction
): action is RenameProjectAction {
  return action.type === ACTION_PROJECT_RENAME;
}
