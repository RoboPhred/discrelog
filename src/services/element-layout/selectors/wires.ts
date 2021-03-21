import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";

import { AppState } from "@/store";
import { Point, pointAdd, ZeroPoint } from "@/geometry";

import { ElementDefinition } from "@/elements/types";
import { elementDefinitionFromElementIdSelector } from "@/services/element-graph/selectors/element-def";
import { elementConnectionIdsFromElementIdSelector } from "@/services/element-graph/selectors/connections";

import { createElementLayoutSelector } from "../utils";
import { ElementLayoutServiceState } from "../state";

import { elementPositionFromElementIdSelector } from "./element-positions";
import { elementIdsFromCircuitIdSelector } from "@/services/circuits/selectors/elements";

interface PositionCache {
  inputElementDef: ElementDefinition;
  inputElementPosition: Point;
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
    outputPin: { elementId, pinId },
  } = state.services.elementGraph.connectionsById[connectionId];

  const def = elementDefinitionFromElementIdSelector(state, elementId);
  if (!def) {
    return ZeroPoint;
  }

  const elementPosition = elementPositionFromElementIdSelector(
    state,
    elementId
  );

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = startPositionCacheByConnectionId[connectionId];
  if (
    cacheData &&
    cacheData.inputElementDef === def &&
    cacheData.inputElementPosition.x === elementPosition.x &&
    cacheData.inputElementPosition.y === elementPosition.y
  ) {
    return cacheData.outputPosition;
  }

  let offset = ZeroPoint;
  if (def && def.pins[pinId]) {
    offset = def.pins[pinId];
  }
  const position = pointAdd(elementPosition, offset);
  startPositionCacheByConnectionId[connectionId] = {
    inputElementDef: def,
    inputElementPosition: elementPosition,
    outputPosition: position,
  };

  return position;
};

export const wireEndPositionFromConnectionIdSelector = (
  state: AppState,
  connectionId: string
) => {
  const {
    inputPin: { elementId, pinId },
  } = state.services.elementGraph.connectionsById[connectionId];
  const def = elementDefinitionFromElementIdSelector(state, elementId);
  if (!def) {
    return ZeroPoint;
  }

  const elementPosition = elementPositionFromElementIdSelector(
    state,
    elementId
  );

  // Caching is to get a consistent reference to avoid component rerenders.
  //  We are not concerned about performance here.
  const cacheData = endPositionCacheByConnectionId[connectionId];
  if (
    cacheData &&
    cacheData.inputElementDef === def &&
    cacheData.inputElementPosition.x === elementPosition.x &&
    cacheData.inputElementPosition.y === elementPosition.y
  ) {
    return cacheData.outputPosition;
  }

  let offset = ZeroPoint;
  if (def && def.pins[pinId]) {
    offset = def.pins[pinId];
  }
  const position = pointAdd(elementPosition, offset);
  endPositionCacheByConnectionId[connectionId] = {
    inputElementDef: def,
    inputElementPosition: elementPosition,
    outputPosition: position,
  };

  return position;
};

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const jointIdsSelector = createElementLayoutSelector(
  (state: ElementLayoutServiceState) =>
    Object.keys(state.wireJointPositionsByJointId)
);

/**
 * Gets all joint ids in the editing circuit.
 * WARN: Not react safe, for reducer use only.
 */
export const jointIdsFromCircuitIdSelector = (
  state: AppState,
  circuitId: string
) => {
  const elementIds = elementIdsFromCircuitIdSelector(state, circuitId);
  const connectionIds = flatMap(elementIds, (elementId) =>
    elementConnectionIdsFromElementIdSelector(state, elementId)
  );
  const jointIds = flatMap(connectionIds, (connectionId) =>
    wireJointIdsFromConnectionIdSelector(state, connectionId)
  );
  return uniq(jointIds);
};

export const wireJointIdsByConnectionIdSelector = createElementLayoutSelector(
  (state) => state.wireJointIdsByConnectionId
);

export const wireJointIdsFromConnectionIdSelector = createElementLayoutSelector(
  (state: ElementLayoutServiceState, connectionId: string) =>
    state.wireJointIdsByConnectionId[connectionId]
);

export const wireJointPositionFromJointIdSelector = createElementLayoutSelector(
  (state: ElementLayoutServiceState, jointId: string) =>
    state.wireJointPositionsByJointId[jointId]
);

// WARN: Returns new object with each invocation.  Not safe for react use.
//  Currently used to get all joint ids in reducers.
export const wireJointPositionsByJointIdSelector = createElementLayoutSelector(
  (state: ElementLayoutServiceState) => {
    return state.wireJointPositionsByJointId;
  }
);
