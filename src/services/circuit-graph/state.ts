import { Element, Connection } from "./types";

export interface CircuitGraphServiceState {
  /**
   * A map of elements by element id.
   */
  elementsById: Record<string, Element>;

  /**
   * A map of connections between elements, by connection id.
   */
  connectionsById: Record<string, Connection>;
}

const _defaultState: CircuitGraphServiceState = {
  elementsById: {},
  connectionsById: {},
};

export const defaultCircuitGraphServiceState = Object.freeze(_defaultState);
