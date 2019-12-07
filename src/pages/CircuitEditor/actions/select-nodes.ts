import { AnyAction } from "redux";

import { SelectionMode } from "../types";

export const ACTION_SELECT_NODES = "@editor/select/nodes" as "@editor/select/nodes";
export const selectNodes = (
  nodeId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_NODES,
  payload: {
    nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId],
    mode
  }
});
export type SelectNodesAction = ReturnType<typeof selectNodes>;
export function isSelectNodesAction(
  action: AnyAction
): action is SelectNodesAction {
  return action.type === ACTION_SELECT_NODES;
}
