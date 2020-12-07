import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import {
  ElementDefinition,
  ElementDefinitionsByType,
  ElementType,
} from "@/elements";
import { Point, pointAdd, ZeroPoint } from "@/geometry";

import { NodePin } from "@/services/circuit-graph/types";
import {
  elementDefFromNodeIdSelector,
  elementTypesByNodeIdSelector,
} from "@/services/circuit-graph/selectors/nodes";

import { createCircuitLayoutSelector } from "../utils";
import { CircuitLayoutState } from "../state";

export const nodePositionsByNodeIdSelector = createCircuitLayoutSelector(
  (state) => state.nodePositionsById
);

export const nodePositionFromNodeIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState, nodeId: string) => state.nodePositionsById[nodeId]
);

export const nodePinPositionsByPinIdByNodeIdSelector = createSelector(
  nodePositionsByNodeIdSelector,
  elementTypesByNodeIdSelector,
  (
    nodePositionsByNodeId: Record<string, Point>,
    elementTypesByNodeId: Record<string, ElementType>
  ) => {
    const nodePinPositionsByPinIdByNodeId: Record<
      string,
      Record<string, Point>
    > = {};

    const nodeIds = Object.keys(elementTypesByNodeId);
    for (const nodeId of nodeIds) {
      const nodePinPositionsByPinId: Record<string, Point> = {};
      nodePinPositionsByPinIdByNodeId[nodeId] = nodePinPositionsByPinId;

      const nodePosition = nodePositionsByNodeId[nodeId] ?? ZeroPoint;

      const elementType = elementTypesByNodeId[nodeId];
      if (!elementType) {
        continue;
      }
      const def = ElementDefinitionsByType[elementType];
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
