import { AppState } from "@/store";
import { Point, pointAdd, ZeroPoint } from "@/geometry";
import { NodeType, NodeDefinitionsByType } from "@/nodes";

import {
  nodeDefFromNodeIdSelector,
  nodeTypeFromNodeIdSelector,
} from "@/services/circuit-graph/selectors/nodes";

import { createCircuitLayoutSelector } from "../utils";
import { CircuitLayoutState } from "../state";

import { nodePositionFromNodeIdSelector } from "./node-positions";

interface PositionCache {
  inputNodeType: NodeType;
  inputNodePosition: Point;
  outputPosition: Point;
}

// TODO: These build up forever, need to wipe it on occasion.
// Probably should use LRU cache.
// Not fixing it right now as we previously used re-reselect, which
//  also builds up forever.
const startPositionCacheByConnectionId: Record<string, PositionCache> = {};
const endPositionCacheByConnectionId: Record<string, PositionCache> = {};

export const wireStartPositionFromConnectionIdSelector = (
  state: AppState,
  connectionId: string
) => {
  const {
    outputPin: { nodeId, pinId },
  } = state.services.circuitGraph.connectionsById[connectionId];

  const nodeType = nodeTypeFromNodeIdSelector(state, nodeId);
  if (!nodeType) {
    return ZeroPoint;
  }

  const nodePosition =
    nodePositionFromNodeIdSelector(state, nodeId) || ZeroPoint;

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = startPositionCacheByConnectionId[connectionId];
  if (
    cacheData &&
    cacheData.inputNodeType === nodeType &&
    cacheData.inputNodePosition.x === nodePosition.x &&
    cacheData.inputNodePosition.y === nodePosition.y
  ) {
    return cacheData.outputPosition;
  }

  const nodeDef = NodeDefinitionsByType[nodeType];

  let offset = ZeroPoint;
  if (nodeDef && nodeDef.pins[pinId]) {
    offset = nodeDef.pins[pinId];
  }
  const position = pointAdd(nodePosition, offset);
  startPositionCacheByConnectionId[connectionId] = {
    inputNodeType: nodeType,
    inputNodePosition: nodePosition,
    outputPosition: position,
  };

  return position;
};

export const wireEndPositionFromConnectionIdSelector = (
  state: AppState,
  connectionId: string
) => {
  const {
    inputPin: { nodeId, pinId },
  } = state.services.circuitGraph.connectionsById[connectionId];
  const nodeType = nodeTypeFromNodeIdSelector(state, nodeId);
  if (!nodeType) {
    return ZeroPoint;
  }

  const nodePosition =
    nodePositionFromNodeIdSelector(state, nodeId) || ZeroPoint;

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = endPositionCacheByConnectionId[connectionId];
  if (
    cacheData &&
    cacheData.inputNodeType === nodeType &&
    cacheData.inputNodePosition.x === nodePosition.x &&
    cacheData.inputNodePosition.y === nodePosition.y
  ) {
    return cacheData.outputPosition;
  }

  const nodeDef = NodeDefinitionsByType[nodeType];

  let offset = ZeroPoint;
  if (nodeDef && nodeDef.pins[pinId]) {
    offset = nodeDef.pins[pinId];
  }
  const position = pointAdd(nodePosition, offset);
  endPositionCacheByConnectionId[connectionId] = {
    inputNodeType: nodeType,
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

export const wireJointIdsFromConnectionIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutState, connectionId: string) =>
    state.wireJointIdsByConnectionId[connectionId]
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
