import { createSelector } from "reselect";

import { AppState } from "@/store";

import {
  magnitude,
  Point,
  pointAdd,
  pointSubtract,
  ZeroPoint,
} from "@/geometry";

import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeDefinitionsByTypeSelector } from "@/services/node-types/selectors/node-types";
import {
  nodeIdsByCircuitIdSelector,
  nodeIdsFromCircuitIdSelector,
} from "@/services/circuits/selectors/nodes";
import { NodePin, nodePinEquals } from "@/services/node-graph/types";

import { nodePositionsByNodeIdSelector } from "./node-positions";

export const nodePinPositionsByPinIdByNodeIdSelector = createSelector(
  nodeDefinitionsByTypeSelector,
  nodePositionsByNodeIdSelector,
  nodeTypesByNodeIdSelector,
  (nodeDefsByType, nodePositionsByNodeId, nodeTypesByNodeId) => {
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
      const def = nodeDefsByType[elementType];
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

let cachedPinFromPoint: NodePin | null = null;
export const nodePinFromPointSelector = (
  state: AppState,
  point: Point,
  circuitId: string
) => {
  const pinPositionsByPinByNode = nodePinPositionsByPinIdByNodeIdSelector(
    state
  );
  const nodeIds = nodeIdsFromCircuitIdSelector(state, circuitId);
  if (!nodeIds) {
    return null;
  }

  for (const nodeId of nodeIds) {
    const pinPositionsByPinId = pinPositionsByPinByNode[nodeId] ?? ZeroPoint;
    const pinIds = Object.keys(pinPositionsByPinId);
    for (const pinId of pinIds) {
      const pinPosition = pinPositionsByPinId[pinId];
      const offset = pointSubtract(point, pinPosition);
      const length = magnitude(offset);
      if (length > 6) {
        continue;
      }

      const pin: NodePin = { nodeId, pinId };
      if (!cachedPinFromPoint || !nodePinEquals(pin, cachedPinFromPoint)) {
        cachedPinFromPoint = pin;
      }
      return cachedPinFromPoint;
    }
  }

  return null;
};
