export const ACTION_NODE_HOVER = "@editor/node/hover" as "@editor/node/hover";
export const hoverNode = (nodeId: string | null) => ({
  type: ACTION_NODE_HOVER,
  payload: { nodeId }
});
export type HoverNodeAction = ReturnType<typeof hoverNode>;
