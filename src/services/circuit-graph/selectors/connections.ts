import values from "lodash/values";
import { createSelector } from "reselect";

import { CircuitGraphState } from "../state";
import { createCircuitGraphSelector } from "../utils";

export const connectionsByIdSelector = createCircuitGraphSelector(
  (s) => s.connectionsById
);

export const connectionIdsSelector = createCircuitGraphSelector(
  createSelector(
    (s) => s.connectionsById,
    (wiresById) => Object.keys(wiresById)
  )
);

export const connectionFromConnectionIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, connectionId: string) =>
    s.connectionsById[connectionId]
);

export const connectionsSelector = createCircuitGraphSelector(
  createSelector(
    (state: CircuitGraphState) => state.connectionsById,
    (wiresById) => values(wiresById)
  )
);

/**
 * Gets all wire ids supplying input to the specified node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeInputConnectionIdsFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].inputPin.nodeId === nodeId
    )
);

/**
 * Gets an array of wire ids leaving the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeOutputConnectionIdsFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].outputPin.nodeId === nodeId
    )
);
