import { AppState } from "@/store";
import { pointAdd, ZeroPoint } from "@/geometry";
import { NodeDefinition } from "@/node-defs";
import { Point } from "@/types";

import { nodeDefSelector } from "@/services/graph/selectors/nodes";

import { createFieldSelector } from "../utils";
import { FieldState } from "../state";

import { nodePositionSelector } from "./positions";

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

export const wireStartPositionSelector = (state: AppState, wireId: string) => {
  const {
    outputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  const nodeDef = nodeDefSelector(state, nodeId);
  const nodePosition = nodePositionSelector(state, nodeId) || ZeroPoint;

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

export const wireEndPositionSelector = (state: AppState, wireId: string) => {
  const {
    inputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  const nodeDef = nodeDefSelector(state, nodeId);
  const nodePosition = nodePositionSelector(state, nodeId) || ZeroPoint;

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

export const wireJointsSelector = createFieldSelector(
  (state: FieldState, wireId: string) => state.wireJointsByWireId[wireId]
);
