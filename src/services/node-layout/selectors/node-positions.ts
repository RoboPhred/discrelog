import { createNodeLayoutSelector } from "../utils";
import { NodeLayoutServiceState } from "../state";

export const nodePositionsByNodeIdSelector = createNodeLayoutSelector(
  (state) => state.nodePositionsById
);

export const nodePositionFromNodeIdSelector = createNodeLayoutSelector(
  (state: NodeLayoutServiceState, nodeId: string) =>
    state.nodePositionsById[nodeId]
);
