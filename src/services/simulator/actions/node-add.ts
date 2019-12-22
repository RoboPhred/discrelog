import uuidV4 from "uuid/v4";
import { AnyAction } from "redux";

import { NodeType } from "@/node-defs";

export const ACTION_NODE_ADD = "@sim/node/add" as const;
export const addNode = (nodeType: NodeType, nodeId?: string) => ({
  type: ACTION_NODE_ADD,
  payload: { nodeId: nodeId || uuidV4(), nodeType }
});
export type AddNodeAction = ReturnType<typeof addNode>;
export function isAddNodeAction(action: AnyAction): action is AddNodeAction {
  return action.type === ACTION_NODE_ADD;
}
