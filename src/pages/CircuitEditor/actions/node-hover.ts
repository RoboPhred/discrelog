import { AnyAction } from "redux";

export const ACTION_NODE_HOVER = "@editor/node/hover" as const;
export const hoverNode = (nodeId: string | null) => ({
  type: ACTION_NODE_HOVER,
  payload: { nodeId }
});
export type HoverNodeAction = ReturnType<typeof hoverNode>;
export function isHoverNodeAction(
  action: AnyAction
): action is HoverNodeAction {
  return action.type === ACTION_NODE_HOVER;
}
