import { createSelector } from "reselect";
import { includes } from "lodash";

import { AppState } from "@/store";

import { Connection } from "@/services/circuit-graph/types";

import {
  circuitIdFromElementIdSelector,
  elementIdsFromCircuitIdSelector,
} from "./elements";

/**
 * Get all connection ids for the given circuit id.
 *
 * A connection is in the circuit if both its input and output are for elements in this circuit.
 *
 * WARN: Single-memoized, cache will bust if new circuit id passed.
 */
export const connectionIdsByCircuitIdSelector = createSelector(
  (state: AppState, circuitId: string) =>
    elementIdsFromCircuitIdSelector(state, circuitId),
  (state: AppState) => state.services.circuitGraph.connectionsById,
  (elementIds: string[], connectionsById: Record<string, Connection>) => {
    return Object.keys(connectionsById).filter((connectionId) => {
      const { inputPin, outputPin } = connectionsById[connectionId];

      if (!includes(elementIds, inputPin.elementId)) {
        return false;
      }

      if (!includes(elementIds, outputPin.elementId)) {
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
  const { connectionsById } = state.services.circuitGraph;
  const conn = connectionsById[connectionId];
  if (!conn) {
    return null;
  }

  // Input or output doesn't matter,
  // the ui prevents connections from crossing circuit boundaries.
  const { elementId } = conn.inputPin || conn.outputPin;
  return circuitIdFromElementIdSelector(state, elementId);
};
