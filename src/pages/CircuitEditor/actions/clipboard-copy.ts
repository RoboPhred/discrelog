import { AnyAction } from "redux";

export const ACTION_COPY_NODES = "@editor/copy" as "@editor/copy";
export const copyNodes = (nodeId: string | string[]) => ({
  type: ACTION_COPY_NODES,
  payload: {
    nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId]
  }
});
export type CopyNodesAction = ReturnType<typeof copyNodes>;
export function isCopyNodesAction(
  action: AnyAction
): action is CopyNodesAction {
  return action.type === ACTION_COPY_NODES;
}
