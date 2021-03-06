import values from "lodash/values";
import uniq from "lodash/uniq";
import { createSelector } from "reselect";

import { NodeGraphServiceState } from "../state";
import { createNodeGraphSelector } from "../utils";

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
