import { AnyAction } from "redux";

export const ACTION_VIEW_ACTIVATE = "@view/activate" as const;
export const activateView = (tesselPath: string[]) => ({
  type: ACTION_VIEW_ACTIVATE,
  payload: { tesselPath },
});
export type ActivateViewAction = ReturnType<typeof activateView>;
export function isActivateViewAction(
  action: AnyAction
): action is ActivateViewAction {
  return action.type === ACTION_VIEW_ACTIVATE;
}
