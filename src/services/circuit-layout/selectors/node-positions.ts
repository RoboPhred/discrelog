import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import { ElementDefinition } from "@/element-defs";
import { Point, pointAdd } from "@/geometry";

import { NodePin } from "@/services/circuit-graph/types";
import { elementDefFromNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";

import { createCircuitLayoutSelector } from "../utils";
import { CircuitLayoutState } from "../state";

export const nodePositionsByNodeIdSelector = createCircuitLayoutSelector(
  (state) => state.nodePositionsById
);

export const nodePositionFromNodeIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState, nodeId: string) => state.nodePositionsById[nodeId]
);

const nodePinPositionFromNodePinCachedSelector = createCachedSelector(
  (state: AppState, pin: NodePin) =>
    elementDefFromNodeIdSelector(state, pin.nodeId),
  (state: AppState, pin: NodePin) =>
    nodePositionFromNodeIdSelector(state, pin.nodeId),
  // break this out so we do not bust the cache when our input changes.
  (_: any, pin: NodePin) => pin.pinId,
  (def: ElementDefinition | null, nodePosition: Point, pinId: string) => {
    if (!def || !def.pins[pinId]) {
      return null;
    }
    const pin = def.pins[pinId];
    const pinPosition = { x: pin.x, y: pin.y };
    return pointAdd(nodePosition, pinPosition);
  }
)((_: any, pin: NodePin) => `${pin.nodeId}:${pin.pinId}`);

export const nodePinPositionFromNodePinSelector = (
  state: AppState,
  nodeId: string,
  pinId: string
) => {
  return nodePinPositionFromNodePinCachedSelector(state, { nodeId, pinId });
};
