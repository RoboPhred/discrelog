import { AnyAction } from "redux";

export const ACTION_NODE_RENAME = "@node/rename" as const;
export const renameNode = (nodeId: string, nodeName: string) => ({
  type: ACTION_NODE_RENAME,
  payload: { nodeId, nodeName },
});
export type RenameNodeAction = ReturnType<typeof renameNode>;
export function isRenameNodeAction(
  action: AnyAction
): action is RenameNodeAction {
  return action.type === ACTION_NODE_RENAME;
}
