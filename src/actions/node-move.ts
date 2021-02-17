import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";
import { Point } from "@/geometry";

export interface MoveNodeOpts {
  relative?: boolean;
  snapMode?: "none" | "node";
}
export const ACTION_NODE_MOVE = "@node/move" as const;
export const moveNode = (
  nodeId: MaybeArray<string>,
  position: Point,
  opts: MoveNodeOpts = {}
) => ({
  type: ACTION_NODE_MOVE,
  payload: {
    nodeIds: asArray(nodeId),
    position,
    relative: opts.relative ?? false,
    snapMode: opts.snapMode ?? "none",
  },
});
export type MoveNodeAction = ReturnType<typeof moveNode>;
export function isMoveNodeAction(action: AnyAction): action is MoveNodeAction {
  return action.type === ACTION_NODE_MOVE;
}
