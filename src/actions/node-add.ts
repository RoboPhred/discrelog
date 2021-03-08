import { v4 as uuidV4 } from "uuid";
import { AnyAction } from "redux";

import { Point } from "@/geometry";

export interface AddNodeOptions {
  nodeId?: string;
  nodeName?: string;
}
export const ACTION_NODE_ADD = "@node/add" as const;
export const addNode = (
  nodeType: string,
  circuitId: string,
  position: Point,
  opts?: AddNodeOptions
) => ({
  type: ACTION_NODE_ADD,
  payload: { nodeId: uuidV4(), nodeType, circuitId, position, ...(opts || {}) },
});
export type AddNodeAction = ReturnType<typeof addNode>;
export function isAddNodeAction(action: AnyAction): action is AddNodeAction {
  return action.type === ACTION_NODE_ADD;
}
