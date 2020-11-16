import find from "lodash/find";
import values from "lodash/values";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

import { NodePin } from "../types";

import { CircuitGraphState } from "../state";
import { createCircuitGraphSelector } from "../utils";

import { elementDefFromNodeIdSelector } from "./nodes";

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
 * Gets an array of wires leaving the given node id.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeOutputConnectionsFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) =>
    connectionsSelector
      .local(state)
      .filter((x) => x.outputPin.nodeId === nodeId)
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
