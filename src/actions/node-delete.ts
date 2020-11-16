import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";

export const ACTION_NODE_DELETE = "@node/delete" as const;
export const deleteNode = (nodeId: MaybeArray<string>) => ({
  type: ACTION_NODE_DELETE,
  payload: { nodeIds: asArray(nodeId) },
});
export type DeleteNodeAction = ReturnType<typeof deleteNode>;
export function isDeleteNodeAction(
  action: AnyAction
): action is DeleteNodeAction {
  return action.type === ACTION_NODE_DELETE;
}
