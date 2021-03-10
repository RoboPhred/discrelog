import { AnyAction } from "redux";

export const VIEW_RESET = "@view/reset" as const;
export const resetView = () => ({
  type: VIEW_RESET,
});
export type ResetViewAction = ReturnType<typeof resetView>;
export function isResetViewAction(
  action: AnyAction
): action is ResetViewAction {
  return action.type === VIEW_RESET;
}
