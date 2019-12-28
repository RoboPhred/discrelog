import { AnyAction } from "redux";

export const ACTION_INIT = "@init";
export const doInit = () => ({ type: ACTION_INIT });
export type InitAction = ReturnType<typeof doInit>;
export function isInitAction(action: AnyAction): action is InitAction {
  return action.type === ACTION_INIT;
}
