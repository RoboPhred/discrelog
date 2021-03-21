import values from "lodash/values";
import uniq from "lodash/uniq";
import { createSelector } from "reselect";

import { ElementGraphServiceState } from "../state";
import { createElementGraphSelector } from "../utils";
import { ElementPin, elementPinEquals } from "../types";

export const connectionsByIdSelector = createElementGraphSelector(
  (s) => s.connectionsById
);

export const connectionIdsSelector = createElementGraphSelector(
  createSelector(
    (s) => s.connectionsById,
    (connectionsById) => Object.keys(connectionsById)
  )
);

export const connectionFromConnectionIdSelector = createElementGraphSelector(
  (s: ElementGraphServiceState, connectionId: string) =>
    s.connectionsById[connectionId]
);

export const connectionsSelector = createElementGraphSelector(
  createSelector(
    (state: ElementGraphServiceState) => state.connectionsById,
    (connectionsById) => values(connectionsById)
  )
);

export const connectionIdFromInputPinSelector = createElementGraphSelector(
  (state: ElementGraphServiceState, pin: ElementPin) => {
    const { connectionsById } = state;
    const connectionIds = Object.keys(connectionsById);
    for (const connectionId of connectionIds) {
      const connection = connectionsById[connectionId];
      if (elementPinEquals(connection.inputPin, pin)) {
        return connectionId;
      }
    }

    return null;
  }
);

export const connectionIdFromOutputPinSelector = createElementGraphSelector(
  (state: ElementGraphServiceState, pin: ElementPin) => {
    const { connectionsById } = state;
    const connectionIds = Object.keys(connectionsById);
    for (const connectionId of connectionIds) {
      const connection = connectionsById[connectionId];
      if (elementPinEquals(connection.outputPin, pin)) {
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
export const elementInputConnectionIdsFromElementIdSelector = createElementGraphSelector(
  (state: ElementGraphServiceState, elementId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].inputPin.elementId === elementId
    )
);

/**
 * Gets an array of connection ids leaving the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const elementOutputConnectionIdsFromElementIdSelector = createElementGraphSelector(
  (state: ElementGraphServiceState, elementId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].outputPin.elementId === elementId
    )
);

/**
 * Gets an array of connection ids attached to the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const elementConnectionIdsFromElementIdSelector = createElementGraphSelector(
  (state: ElementGraphServiceState, elementId: string) => {
    const inputs = elementInputConnectionIdsFromElementIdSelector.local(
      state,
      elementId
    );
    const outputs = elementOutputConnectionIdsFromElementIdSelector.local(
      state,
      elementId
    );
    return uniq([...inputs, ...outputs]);
  }
);
