import { AppState } from "@/store";
import { pointAdd, ZeroPoint } from "@/geometry";
import { NodeDefinition } from "@/node-defs";
import { Point } from "@/types";

import { nodeDefFromNodeIdSelector } from "@/services/graph/selectors/nodes";

import { createFieldSelector } from "../utils";
import { FieldState } from "../state";

import { nodePositionFromNodeIdSelector } from "./positions";

interface PositionCache {
  inputNodeDef: NodeDefinition | null;
  inputNodePosition: Point;
  outputPosition: Point;
}

// TODO: These build up forever, need to wipe it on occasion.
// Probably should use LRU cache.
// Not fixing it right now as we previously used re-reselect, which
//  also builds up forever.
const startPositionCacheByWireId: Record<string, PositionCache> = {};
const endPositionCacheByWireId: Record<string, PositionCache> = {};

export const wireStartPositionFromWireIdSelector = (
  state: AppState,
  wireId: string
) => {
  const {
    outputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  const nodeDef = nodeDefFromNodeIdSelector(state, nodeId);
  const nodePosition =
    nodePositionFromNodeIdSelector(state, nodeId) || ZeroPoint;

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = startPositionCacheByWireId[wireId];
  if (
    cacheData &&
    cacheData.inputNodeDef === nodeDef &&
    cacheData.inputNodePosition === nodePosition
  ) {
    return cacheData.outputPosition;
  }

  let offset = ZeroPoint;
  if (nodeDef && nodeDef.pins[pinId]) {
    offset = nodeDef.pins[pinId];
  }
  const position = pointAdd(nodePosition, offset);
  startPositionCacheByWireId[wireId] = {
    inputNodeDef: nodeDef,
    inputNodePosition: nodePosition,
    outputPosition: position
  };

  return position;
};

export const wireEndPositionFromWireIdSelector = (
  state: AppState,
  wireId: string
) => {
  const {
    inputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  const nodeDef = nodeDefFromNodeIdSelector(state, nodeId);
  const nodePosition =
    nodePositionFromNodeIdSelector(state, nodeId) || ZeroPoint;

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = endPositionCacheByWireId[wireId];
  if (
    cacheData &&
    cacheData.inputNodeDef === nodeDef &&
    cacheData.inputNodePosition === nodePosition
  ) {
    return cacheData.outputPosition;
  }

  let offset = ZeroPoint;
  if (nodeDef && nodeDef.pins[pinId]) {
    offset = nodeDef.pins[pinId];
  }
  const position = pointAdd(nodePosition, offset);
  endPositionCacheByWireId[wireId] = {
    inputNodeDef: nodeDef,
    inputNodePosition: nodePosition,
    outputPosition: position
  };

  return position;
};

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const jointIdsSelector = createFieldSelector((state: FieldState) =>
  Object.keys(state.wireJointPositionsByJointId)
);

export const wireJointIdsFromWireIdSelector = createFieldSelector(
  (state: FieldState, wireId: string) => state.wireJointIdsByWireId[wireId]
);

export const wireJointPositionFromJointIdSelector = createFieldSelector(
  (state: FieldState, jointId: string) =>
    state.wireJointPositionsByJointId[jointId]
);

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const wireJointPositionsByJointIdSelector = createFieldSelector(
  (state: FieldState) => {
    const positionsByJointId: Record<string, Point> = {};

    for (const jointId of Object.keys(state.wireJointPositionsByJointId)) {
      const p = state.wireJointPositionsByJointId[jointId];
      positionsByJointId[jointId] = p;
    }

    return positionsByJointId;
  }
);
