import { Element, Connection } from "./types";

export interface ElementGraphServiceState {
  /**
   * A map of elements by element id.
   */
  elementsById: Record<string, Element>;

  /**
   * A map of connections between elements, by connection id.
   */
  connectionsById: Record<string, Connection>;
}

const _defaultState: ElementGraphServiceState = {
  elementsById: {},
  connectionsById: {},
};

export const defaultElementGraphServiceState = Object.freeze(_defaultState);
