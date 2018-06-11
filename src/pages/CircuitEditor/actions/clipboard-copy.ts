export const ACTION_COPY_NODES = "@editor/copy" as "@editor/copy";
export const copyNodes = (nodeId: string | string[]) => ({
  type: ACTION_COPY_NODES,
  payload: {
    nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId]
  }
});
export type CopyNodesAction = ReturnType<typeof copyNodes>;
