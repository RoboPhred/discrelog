import values from "lodash/values";
import uniq from "lodash/uniq";
import { createSelector } from "reselect";

import { NodeGraphServiceState } from "../state";
import { createNodeGraphSelector } from "../utils";
import { NodePin, nodePinEquals } from "../types";

export const connectionsByIdSelector = createNodeGraphSelector(
  (s) => s.connectionsById
);

export const connectionIdsSelector = createNodeGraphSelector(
  createSelector(
    (s) => s.connectionsById,
    (connectionsById) => Object.keys(connectionsById)
  )
);

export const connectionFromConnectionIdSelector = createNodeGraphSelector(
  (s: NodeGraphServiceState, connectionId: string) =>
    s.connectionsById[connectionId]
);

export const connectionsSelector = createNodeGraphSelector(
  createSelector(
    (state: NodeGraphServiceState) => state.connectionsById,
    (connectionsById) => values(connectionsById)
  )
);

export const connectionIdFromInputPinSelector = createNodeGraphSelector(
  (state: NodeGraphServiceState, pin: NodePin) => {
    const { connectionsById } = state;
    const connectionIds = Object.keys(connectionsById);
    for (const connectionId of connectionIds) {
      const connection = connectionsById[connectionId];
      if (nodePinEquals(connection.inputPin, pin)) {
        return connectionId;
      }
    }

    return null;
  }
);

export const connectionIdFromOutputPinSelector = createNodeGraphSelector(
  (state: NodeGraphServiceState, pin: NodePin) => {
    const { connectionsById } = state;
    const connectionIds = Object.keys(connectionsById);
    for (const connectionId of connectionIds) {
      const connection = connectionsById[connectionId];
      if (nodePinEquals(connection.outputPin, pin)) {
        return connectionId;
      }
    }

    return null;
  }
);

/**
 * Gets an array of connection ids supplying input to the specified node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeInputConnectionIdsFromNodeIdSelector = createNodeGraphSelector(
  (state: NodeGraphServiceState, nodeId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].inputPin.nodeId === nodeId
    )
);

/**
 * Gets an array of connection ids leaving the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeOutputConnectionIdsFromNodeIdSelector = createNodeGraphSelector(
  (state: NodeGraphServiceState, nodeId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].outputPin.nodeId === nodeId
    )
);

/**
 * Gets an array of connection ids attached to the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeConnectionIdsFromNodeIdSelector = createNodeGraphSelector(
  (state: NodeGraphServiceState, nodeId: string) => {
    const inputs = nodeInputConnectionIdsFromNodeIdSelector.local(
      state,
      nodeId
    );
    const outputs = nodeOutputConnectionIdsFromNodeIdSelector.local(
      state,
      nodeId
    );
    return uniq([...inputs, ...outputs]);
  }
);
