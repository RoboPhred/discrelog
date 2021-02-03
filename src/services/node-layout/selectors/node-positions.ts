import { createSelector } from "reselect";

import { AppState } from "@/store";

import { NodeDefinitionsByType, NodeType } from "@/nodes";
import { Point, pointAdd, ZeroPoint } from "@/geometry";

import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import { createNodeLayoutSelector } from "../utils";
import { NodeLayoutState } from "../state";

export const nodePositionsByNodeIdSelector = createNodeLayoutSelector(
  (state) => state.nodePositionsById
);

export const nodePositionFromNodeIdSelector = createNodeLayoutSelector(
  (state: NodeLayoutState, nodeId: string) => state.nodePositionsById[nodeId]
);

export const nodePinPositionsByPinIdByNodeIdSelector = createSelector(
  nodePositionsByNodeIdSelector,
  nodeTypesByNodeIdSelector,
  (
    nodePositionsByNodeId: Record<string, Point>,
    nodeTypesByNodeId: Record<string, NodeType>
  ) => {
    const nodePinPositionsByPinIdByNodeId: Record<
      string,
      Record<string, Point>
    > = {};

    const nodeIds = Object.keys(nodeTypesByNodeId);
    for (const nodeId of nodeIds) {
      const nodePinPositionsByPinId: Record<string, Point> = {};
      nodePinPositionsByPinIdByNodeId[nodeId] = nodePinPositionsByPinId;

      const nodePosition = nodePositionsByNodeId[nodeId] ?? ZeroPoint;

      const elementType = nodeTypesByNodeId[nodeId];
      if (!elementType) {
        continue;
      }
      const def = NodeDefinitionsByType[elementType];
      if (!def) {
        continue;
      }

      const pinIds = Object.keys(def.pins);
      for (const pinId of pinIds) {
        const relPinPosition = def.pins[pinId];
        const pinPosition = pointAdd(nodePosition, relPinPosition);
        nodePinPositionsByPinId[pinId] = pinPosition;
      }
    }

    return nodePinPositionsByPinIdByNodeId;
  }
);

export const nodePinPositionFromNodePinSelector = (
  state: AppState,
  nodeId: string,
  pinId: string
) => {
  const positonsByPinIdByNodeId = nodePinPositionsByPinIdByNodeIdSelector(
    state
  );
  const nodePinPositions = positonsByPinIdByNodeId[nodeId];
  if (!nodePinPositions) {
    return ZeroPoint;
  }
  return nodePinPositions[pinId] ?? ZeroPoint;
};
