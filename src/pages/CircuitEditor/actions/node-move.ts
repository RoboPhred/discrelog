import { AnyAction } from "redux";

export const ACTION_NODE_MOVE = "@editor/node/move" as const;
export const moveNodes = (
  nodeId: string | string[],
  offsetX: number,
  offsetY: number
) => ({
  type: ACTION_NODE_MOVE,
  payload: {
    nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId],
    offsetX,
    offsetY
  }
});
export type MoveNodesAction = ReturnType<typeof moveNodes>;
export function isMoveNodesAction(
  action: AnyAction
): action is MoveNodesAction {
  return action.type === ACTION_NODE_MOVE;
}
