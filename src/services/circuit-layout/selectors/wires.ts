import { AppState } from "@/store";
import { Point, pointAdd, ZeroPoint } from "@/geometry";
import { ElementDefinition } from "@/element-defs";

import { elementDefFromNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";

import { createCircuitLayoutSelector } from "../utils";
import { CircuitLayoutState } from "../state";

import { nodePositionFromNodeIdSelector } from "./node-positions";

interface PositionCache {
  inputNodeDef: ElementDefinition | null;
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
    outputPin: { nodeId, pinId },
  } = state.services.circuitGraph.wiresById[wireId];
  const nodeDef = elementDefFromNodeIdSelector(state, nodeId);
  const nodePosition =
    nodePositionFromNodeIdSelector(state, nodeId) || ZeroPoint;

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = startPositionCacheByWireId[wireId];
  if (
    cacheData &&
    cacheData.inputNodeDef === nodeDef &&
    cacheData.inputNodePosition.x === nodePosition.x &&
    cacheData.inputNodePosition.y === nodePosition.y
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
    outputPosition: position,
  };

  return position;
};

export const wireEndPositionFromWireIdSelector = (
  state: AppState,
  wireId: string
) => {
  const {
    inputPin: { nodeId, pinId },
  } = state.services.circuitGraph.wiresById[wireId];
  const nodeDef = elementDefFromNodeIdSelector(state, nodeId);
  const nodePosition =
    nodePositionFromNodeIdSelector(state, nodeId) || ZeroPoint;

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = endPositionCacheByWireId[wireId];
  if (
    cacheData &&
    cacheData.inputNodeDef === nodeDef &&
    cacheData.inputNodePosition.x === nodePosition.x &&
    cacheData.inputNodePosition.y === nodePosition.y
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
    outputPosition: position,
  };

  return position;
};

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const jointIdsSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState) => Object.keys(state.wireJointPositionsByJointId)
);

export const wireJointIdsFromWireIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState, wireId: string) =>
    state.wireJointIdsByWireId[wireId]
);

export const wireJointPositionFromJointIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState, jointId: string) =>
    state.wireJointPositionsByJointId[jointId]
);

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const wireJointPositionsByJointIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState) => {
    return state.wireJointPositionsByJointId;
  }
);
