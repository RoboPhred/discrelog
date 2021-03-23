import { AppState } from "@/store";

import { elementDefinitionFromTypeSelector } from "../element-types/selectors/element-types";

import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

import { CircuitGraphServiceState } from "./state";
import { ElementConnection, ElementPin } from "./types";

export const createCircuitGraphReducer = createServiceReducerCreator(
  "circuitGraph"
);
export const createCircuitGraphSelector = createServiceSelectorCreator(
  "circuitGraph"
);

/**
 * Check two pins to see if they can form a valid connection.
 * Returns null if no connection can be made (both inputs or both outputs)
 *
 * Does not check to see if the pins are already connected, or other connections prevent this connection from forming.
 */
export function pinsToConnection(
  state: CircuitGraphServiceState,
  p1: ElementPin,
  p2: ElementPin,
  rootState: AppState
): ElementConnection | null {
  const p1Node = state.elementsById[p1.elementId];
  const p2Node = state.elementsById[p2.elementId];

  if (!p1Node || !p2Node) {
    return null;
  }

  const p1Def = elementDefinitionFromTypeSelector(
    rootState,
    p1Node.elementType
  );
  const p2Def = elementDefinitionFromTypeSelector(
    rootState,
    p2Node.elementType
  );

  if (!p1Def || !p2Def) {
    return null;
  }

  const p1Pin = p1Def.pins[p1.pinId];
  const p2Pin = p2Def.pins[p2.pinId];

  if (!p1Pin || !p2Pin) {
    return null;
  }

  // Pins are in same direction and cannot be connected.
  if (p1Pin.direction === p2Pin.direction) {
    return null;
  }

  const outputPin = p1Pin.direction === "output" ? p1 : p2;
  const inputPin = p1Pin.direction === "input" ? p1 : p2;

  return {
    outputPin,
    inputPin,
  };
}
