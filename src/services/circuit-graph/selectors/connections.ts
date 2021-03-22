import values from "lodash/values";
import uniq from "lodash/uniq";
import { createSelector } from "reselect";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";
import { ElementPin, elementPinEquals } from "../types";

export const connectionsByIdSelector = createCircuitGraphSelector(
  (s) => s.connectionsById
);

export const connectionIdsSelector = createCircuitGraphSelector(
  createSelector(
    (s) => s.connectionsById,
    (connectionsById) => Object.keys(connectionsById)
  )
);

export const connectionFromConnectionIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, connectionId: string) =>
    s.connectionsById[connectionId]
);

export const connectionsSelector = createCircuitGraphSelector(
  createSelector(
    (state: CircuitGraphServiceState) => state.connectionsById,
    (connectionsById) => values(connectionsById)
  )
);

export const connectionIdFromInputPinSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, pin: ElementPin) => {
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

export const connectionIdFromOutputPinSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, pin: ElementPin) => {
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
 * Gets an array of connection ids supplying input to the specified element.
 * WARN: Not react safe.  For reducer use only.
 */
export const elementInputConnectionIdsFromElementIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].inputPin.elementId === elementId
    )
);

/**
 * Gets an array of connection ids leaving the given element.
 * WARN: Not react safe.  For reducer use only.
 */
export const elementOutputConnectionIdsFromElementIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string) =>
    Object.keys(state.connectionsById).filter(
      (connectionId) =>
        state.connectionsById[connectionId].outputPin.elementId === elementId
    )
);

/**
 * Gets an array of connection ids attached to the given element.
 * WARN: Not react safe.  For reducer use only.
 */
export const elementConnectionIdsFromElementIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string) => {
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
