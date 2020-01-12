import createCachedSelector from "re-reselect";

import { AppState } from "@/store";
import { pointAdd, ZeroPoint } from "@/geometry";
import { NodeTypes } from "@/node-defs";

import { createFieldSelector } from "../utils";
import { FieldState } from "../state";

export const wireStartPositionSelector = createCachedSelector(
  (s: AppState, wireId: string) => s.services.graph.wiresById[wireId],
  // TODO: We need a cached selector based on the node id from the previous selector.
  (s: AppState) => s.services.field.nodePositionsById,
  // TODO: We need another selector based off the data from wiresById (the previous selector)
  (s: AppState) => s.services.graph.nodesById,
  (wire, nodePositionsById, nodesById) => {
    const {
      outputPin: { nodeId, pinId }
    } = wire;
    // TODO: Use nodeDefSelector somehow...
    const node = nodesById[nodeId];
    if (!node) {
      return ZeroPoint;
    }
    const nodeDef = NodeTypes[node.type];
    if (!nodeDef) {
      return ZeroPoint;
    }

    let offset = ZeroPoint;
    if (nodeDef && nodeDef.pins[pinId]) {
      offset = nodeDef.pins[pinId];
    }

    const nodePosition = nodePositionsById[nodeId] || ZeroPoint;

    return pointAdd(nodePosition, offset);
  }
)((s: AppState, wireId: string) => wireId);

export const wireEndPositionSelector = createCachedSelector(
  (s: AppState, wireId: string) => s.services.graph.wiresById[wireId],
  // TODO: We need a cached selector based on the node id from the previous selector.
  (s: AppState) => s.services.field.nodePositionsById,
  // TODO: We need another selector based off the data from wiresById (the previous selector)
  (s: AppState) => s.services.graph.nodesById,
  (wire, nodePositionsById, nodesById) => {
    const {
      inputPin: { nodeId, pinId }
    } = wire;
    // TODO: Use nodeDefSelector somehow...
    const node = nodesById[nodeId];
    if (!node) {
      return ZeroPoint;
    }
    const nodeDef = NodeTypes[node.type];
    if (!nodeDef) {
      return ZeroPoint;
    }

    let offset = ZeroPoint;
    if (nodeDef && nodeDef.pins[pinId]) {
      offset = nodeDef.pins[pinId];
    }

    const nodePosition = nodePositionsById[nodeId] || ZeroPoint;

    return pointAdd(nodePosition, offset);
  }
)((s: AppState, wireId: string) => wireId);

export const wireJointsSelector = createFieldSelector(
  (state: FieldState, wireId: string) => state.wireJointsByWireId[wireId]
);
