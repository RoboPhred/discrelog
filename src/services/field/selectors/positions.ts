import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import { pointAdd } from "@/geometry";

import { NodePin } from "@/services/graph/types";
import { nodeDefByNodeIdSelector } from "@/services/graph/selectors/nodes";

import { createFieldSelector } from "../utils";
import { FieldState } from "../state";
import { NodeDefinition } from "@/node-defs";
import { Point } from "@/types";

export const nodePositionsByIdSelector = createFieldSelector(
  state => state.nodePositionsById
);

export const nodePositionByNodeIdSelector = createFieldSelector(
  (state: FieldState, nodeId: string) => state.nodePositionsById[nodeId]
);

const nodePinPositionByNodePinCachedSelector = createCachedSelector(
  (state: AppState, pin: NodePin) => nodeDefByNodeIdSelector(state, pin.nodeId),
  (state: AppState, pin: NodePin) =>
    nodePositionByNodeIdSelector(state, pin.nodeId),
  // break this out so we do not bust the cache when our input changes.
  (_: any, pin: NodePin) => pin.pinId,
  (def: NodeDefinition | null, nodePosition: Point, pinId: string) => {
    if (!def || !def.pins[pinId]) {
      return null;
    }
    const pin = def.pins[pinId];
    const pinPosition = { x: pin.x, y: pin.y };
    return pointAdd(nodePosition, pinPosition);
  }
)((_: any, pin: NodePin) => `${pin.nodeId}:${pin.pinId}`);

export const nodePinPositionByNodePinSelector = (
  state: AppState,
  nodeId: string,
  pinId: string
) => {
  return nodePinPositionByNodePinCachedSelector(state, { nodeId, pinId });
};
