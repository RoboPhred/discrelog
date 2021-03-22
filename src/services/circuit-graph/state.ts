import { ROOT_CIRCUIT_ID } from "../circuits/constants";

import { Element, ElementConnection } from "./types";

export interface CircuitGraphServiceState {
  /**
   * Arrays of element ids contained in a circuit by the containing circuit id.
   */
  elementIdsByCircuitId: Record<string, string[]>;

  /**
   * A map of elements by element id.
   */
  elementsById: Record<string, Element>;

  /**
   * A map of connections between elements, by connection id.
   */
  connectionsById: Record<string, ElementConnection>;
}

const _defaultState: CircuitGraphServiceState = {
  elementIdsByCircuitId: {
    [ROOT_CIRCUIT_ID]: [],
  },
  elementsById: {},
  connectionsById: {},
};

export const defaultCircuitGraphServiceState = Object.freeze(_defaultState);
