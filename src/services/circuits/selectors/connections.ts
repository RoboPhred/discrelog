import { createSelector } from "reselect";
import { includes } from "lodash";

import { AppState } from "@/store";

import { Connection } from "@/services/node-graph/types";

import {
  circuitIdFromNodeIdSelector,
  nodeIdsFromCircuitIdSelector,
} from "./nodes";

/**
 * Get all connection ids for the given circuit id.
 *
 * A connection is in the circuit if both its input and output are for nodes in this circuit.
 *
 * WARN: Single-memoized, cache will bust if new circuit id passed.
 */
export const connectionIdsByCircuitIdSelector = createSelector(
  (state: AppState, circuitId: string) =>
    nodeIdsFromCircuitIdSelector(state, circuitId),
  (state: AppState) => state.services.nodeGraph.connectionsById,
  (nodeIds: string[], connectionsById: Record<string, Connection>) => {
    return Object.keys(connectionsById).filter((connectionId) => {
      const { inputPin, outputPin } = connectionsById[connectionId];

      if (!includes(nodeIds, inputPin.nodeId)) {
        return false;
      }

      if (!includes(nodeIds, outputPin.nodeId)) {
        return false;
      }

      return true;
    });
  }
);

export const circuitIdFromConnectionIdSelector = (
  state: AppState,
  connectionId: string
) => {
  const { connectionsById } = state.services.nodeGraph;
  const conn = connectionsById[connectionId];
  if (!conn) {
    return null;
  }

  // Input or output doesn't matter,
  // the ui prevents connections from crossing circuit boundaries.
  const { nodeId } = conn.inputPin || conn.outputPin;
  return circuitIdFromNodeIdSelector(state, nodeId);
};
