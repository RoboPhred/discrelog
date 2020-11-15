import { v4 as uuidV4 } from "uuid";
import { AnyAction } from "redux";

import { ElementType } from "@/element-defs";
import { Point } from "@/types";

export interface AddNodeOptions {
  nodeId?: string;
  position?: Point;
}
export const ACTION_NODE_ADD = "@node/add" as const;
export const addNode = (nodeType: ElementType, opts?: AddNodeOptions) => ({
  type: ACTION_NODE_ADD,
  payload: { nodeId: uuidV4(), nodeType, ...(opts || {}) },
});
export type AddNodeAction = ReturnType<typeof addNode>;
export function isAddNodeAction(action: AnyAction): action is AddNodeAction {
  return action.type === ACTION_NODE_ADD;
}
