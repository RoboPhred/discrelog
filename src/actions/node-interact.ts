import { AnyAction } from "redux";

export const ACTION_NODE_INTERACT = "@node/interact" as const;
export const interactNode = (nodeId: string) => ({
  type: ACTION_NODE_INTERACT,
  payload: { nodeId }
});
export type InteractNodeAction = ReturnType<typeof interactNode>;
export function isInteractNodeAction(
  action: AnyAction
): action is InteractNodeAction {
  return action.type === ACTION_NODE_INTERACT;
}
