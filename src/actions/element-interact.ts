import { AnyAction } from "redux";

export const ACTION_ELEMENT_INTERACT = "@element/interact" as const;
export const interactElement = (elementIdPath: string[], data?: any) => ({
  type: ACTION_ELEMENT_INTERACT,
  payload: { elementIdPath, data },
});
export type InteractElementAction = ReturnType<typeof interactElement>;
export function isInteractElementAction(
  action: AnyAction
): action is InteractElementAction {
  return action.type === ACTION_ELEMENT_INTERACT;
}
