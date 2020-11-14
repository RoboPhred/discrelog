import { AnyAction } from "redux";

export const ACTION_NODE_DELETE = "@node/delete" as const;
export const deleteNode = (nodeId: string | string[]) => ({
  type: ACTION_NODE_DELETE,
  payload: { nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId] },
});
export type DeleteNodeAction = ReturnType<typeof deleteNode>;
export function isDeleteNodeAction(
  action: AnyAction
): action is DeleteNodeAction {
  return action.type === ACTION_NODE_DELETE;
}
