import { createSelector } from "reselect";
import { includes } from "lodash";

import { AppState } from "@/store";

import { Connection } from "@/services/node-graph/types";

import { nodeIdsByCircuitIdSelector } from "./nodes";

/**
 * Get all connection ids for the given circuit id.
 *
 * A connection is in the circuit if both its input and output are for nodes in this circuit.
 *
 * WARN: Single-memoized, cache will bust if new circuit id passed.
 */
export const connectionIdsByCircuitIdSelector = createSelector(
  (state: AppState, circuitId: string) =>
    nodeIdsByCircuitIdSelector(state, circuitId),
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
