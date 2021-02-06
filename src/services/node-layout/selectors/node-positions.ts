import { createNodeLayoutSelector } from "../utils";
import { NodeLayoutState } from "../state";

export const nodePositionsByNodeIdSelector = createNodeLayoutSelector(
  (state) => state.nodePositionsById
);

export const nodePositionFromNodeIdSelector = createNodeLayoutSelector(
  (state: NodeLayoutState, nodeId: string) => state.nodePositionsById[nodeId]
);
