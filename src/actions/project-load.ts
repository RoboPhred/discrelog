import { AnyAction } from "redux";

export const ACTION_PROJECT_LOAD = "@project/load" as const;
export const loadProject = () => ({
  type: ACTION_PROJECT_LOAD,
});
export type LoadProjectAction = ReturnType<typeof loadProject>;
export function isLoadProjectAction(
  action: AnyAction
): action is LoadProjectAction {
  return action.type === ACTION_PROJECT_LOAD;
}
