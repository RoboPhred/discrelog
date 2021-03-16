import { AppState } from "@/store";

import { circuitIdToNodeType } from "@/nodes/definitions/integrated-circuits/utils";

import { CircuitsServiceState } from "../state";
import { createCircuitsSelector } from "../utils";

export const circuitIdsSelector = createCircuitsSelector((state) =>
  Object.keys(state.circuitNamesByCircuitId)
);

export const circuitNamesByIdSelector = createCircuitsSelector(
  (state) => state.circuitNamesByCircuitId
);

export const circuitNameFromIdSelector = createCircuitsSelector(
  (state: CircuitsServiceState, circuitId: string) =>
    state.circuitNamesByCircuitId[circuitId]
);

const circuitIdForNodeIdSelector = createCircuitsSelector(
  (state: CircuitsServiceState, nodeId: string) => {
    const { nodeIdsByCircuitId } = state;
    const circuitIds = Object.keys(nodeIdsByCircuitId);
    for (const circuitId of circuitIds) {
      if (nodeIdsByCircuitId[circuitId].indexOf(nodeId) !== -1) {
        return circuitId;
      }
    }
    return null;
  }
);

export const circuitWouldRecurseSelector = (
  state: AppState,
  circuitId: string | null,
  targetCircuitId: string
): boolean => {
  if (!circuitId) {
    return false;
  }
  if (circuitId === targetCircuitId) {
    return true;
  }

  const targetCircuitNodeType = circuitIdToNodeType(targetCircuitId);
  const { nodesById } = state.services.nodeGraph;
  const targetCircuitNodeIds = Object.keys(nodesById).filter(
    (nodeId) => nodesById[nodeId].nodeType === targetCircuitNodeType
  );

  return targetCircuitNodeIds.some((nodeId) => {
    const targetContainingCircuitId = circuitIdForNodeIdSelector(state, nodeId);
    if (!targetContainingCircuitId) {
      return false;
    }
    return circuitWouldRecurseSelector(
      state,
      circuitId,
      targetContainingCircuitId
    );
  });
};
