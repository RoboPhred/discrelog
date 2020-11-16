import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";
import { Point } from "@/geometry";

export const ACTION_NODE_MOVE = "@node/move" as const;
export const moveNode = (
  nodeId: MaybeArray<string>,
  position: Point,
  relative = false
) => ({
  type: ACTION_NODE_MOVE,
  payload: { nodeIds: asArray(nodeId), position, relative },
});
export type MoveNodeAction = ReturnType<typeof moveNode>;
export function isMoveNodeAction(action: AnyAction): action is MoveNodeAction {
  return action.type === ACTION_NODE_MOVE;
}
