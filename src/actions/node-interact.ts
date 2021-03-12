import { AnyAction } from "redux";

export const ACTION_NODE_INTERACT = "@node/interact" as const;
export const interactNode = (circuitNodeIdPath: string[], data?: any) => ({
  type: ACTION_NODE_INTERACT,
  payload: { circuitNodeIdPath, data },
});
export type InteractNodeAction = ReturnType<typeof interactNode>;
export function isInteractNodeAction(
  action: AnyAction
): action is InteractNodeAction {
  return action.type === ACTION_NODE_INTERACT;
}
