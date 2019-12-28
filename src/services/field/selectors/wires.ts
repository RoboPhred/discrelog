import { AppState } from "@/store";
import { pointAdd, ZeroPoint } from "@/geometry";

import { nodeDefSelector } from "@/services/graph/selectors/nodes";

import { createFieldSelector } from "../utils";
import { FieldState } from "../state";

import { nodePositionSelector } from "./positions";

export const wireStartPositionSelector = (state: AppState, wireId: string) => {
  const {
    outputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  const nodeDef = nodeDefSelector(state, nodeId);

  let offset = ZeroPoint;
  if (nodeDef && nodeDef.pins[pinId]) {
    offset = nodeDef.pins[pinId];
  }

  return pointAdd(nodePositionSelector(state, nodeId) || ZeroPoint, offset);
};

export const wireEndPositionSelector = (state: AppState, wireId: string) => {
  const {
    inputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  const nodeDef = nodeDefSelector(state, nodeId);

  let offset = ZeroPoint;
  if (nodeDef && nodeDef.pins[pinId]) {
    offset = nodeDef.pins[pinId];
  }

  return pointAdd(nodePositionSelector(state, nodeId) || ZeroPoint, offset);
};

export const wireJointsSelector = createFieldSelector(
  (state: FieldState, wireId: string) => state.wireJointsByWireId[wireId]
);
