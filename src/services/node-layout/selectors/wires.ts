import { AppState } from "@/store";
import { Point, pointAdd, ZeroPoint } from "@/geometry";

import { NodeDefinition } from "@/services/node-types/types";
import { nodeDefFromNodeIdSelector } from "@/services/node-graph/selectors/node-def";

import { createNodeLayoutSelector } from "../utils";
import { NodeLayoutServiceState } from "../state";

import { nodePositionFromNodeIdSelector } from "./node-positions";

interface PositionCache {
  inputNodeDef: NodeDefinition;
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
  } = state.services.nodeGraph.connectionsById[connectionId];

  const nodeDef = nodeDefFromNodeIdSelector(state, nodeId);
  if (!nodeDef) {
    return ZeroPoint;
  }

  const nodePosition = nodePositionFromNodeIdSelector(state, nodeId);

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = startPositionCacheByConnectionId[connectionId];
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
  startPositionCacheByConnectionId[connectionId] = {
    inputNodeDef: nodeDef,
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
  } = state.services.nodeGraph.connectionsById[connectionId];
  const nodeDef = nodeDefFromNodeIdSelector(state, nodeId);
  if (!nodeDef) {
    return ZeroPoint;
  }

  const nodePosition = nodePositionFromNodeIdSelector(state, nodeId);

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = endPositionCacheByConnectionId[connectionId];
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
  endPositionCacheByConnectionId[connectionId] = {
    inputNodeDef: nodeDef,
    inputNodePosition: nodePosition,
    outputPosition: position,
  };

  return position;
};

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const jointIdsSelector = createNodeLayoutSelector(
  (state: NodeLayoutServiceState) =>
    Object.keys(state.wireJointPositionsByJointId)
);

export const wireJointIdsByConnectionIdSelector = createNodeLayoutSelector(
  (state) => state.wireJointIdsByConnectionId
);

export const wireJointIdsFromConnectionIdSelector = createNodeLayoutSelector(
  (state: NodeLayoutServiceState, connectionId: string) =>
    state.wireJointIdsByConnectionId[connectionId]
);

export const wireJointPositionFromJointIdSelector = createNodeLayoutSelector(
  (state: NodeLayoutServiceState, jointId: string) =>
    state.wireJointPositionsByJointId[jointId]
);

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const wireJointPositionsByJointIdSelector = createNodeLayoutSelector(
  (state: NodeLayoutServiceState) => {
    return state.wireJointPositionsByJointId;
  }
);
