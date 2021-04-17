import { AppState } from "@/store";

import {
  circuitIdFromElementIdSelector,
  elementNameOrDefaultFromElementIdSelector,
} from "@/services/circuit-graph/selectors/elements";
import {
  circuitIdToElementType,
  elementTypeToCircuitId,
} from "@/elements/definitions/integrated-circuits/utils";

import { ElementPin } from "../types";

import { connectionsSelector } from "./connections";
import { elementDefinitionFromElementIdSelector } from "./element-def";
import {
  elementIdsFromTypeSelector,
  elementTypeFromElementIdSelector,
} from "./elements";
import { createCircuitGraphSelector } from "../utils";
import { CircuitGraphServiceState } from "../state";

export const pinDirectionFromElementPinSelector = (
  state: AppState,
  elementId: string,
  pinId: string
) => {
  const def = elementDefinitionFromElementIdSelector(state, elementId);
  if (!def) {
    return null;
  }

  const pinDef = def.pins[pinId];
  if (!pinDef) {
    return null;
  }
  return pinDef.direction;
};

/**
 * Gets a map of element input pins to their output sources given an element id.
 *
 * WARN: Not react safe.  For reducer use only
 */
export const elementOutputSourcesByPinIdFromElementIdSelector = (
  state: AppState,
  elementId: string
) => {
  const connections = connectionsSelector(state);
  const def = elementDefinitionFromElementIdSelector(state, elementId);

  if (!def) {
    return {};
  }

  let outputPins: string[] = [];
  outputPins = Object.keys(def.pins).filter(
    (x) => def.pins[x].direction === "output"
  );

  const outputConnections = connections.filter(
    (x) => x.outputPin.elementId === elementId
  );

  const result: Record<string, ElementPin[]> = {};
  for (const pin of outputPins) {
    result[pin] = [];
  }

  for (const connection of outputConnections) {
    const { outputPin, inputPin } = connection;
    result[outputPin.pinId].push(inputPin);
  }

  return result;
};

export const elementPinsFromPinElementSelector = (
  state: AppState,
  elementId: string
): ElementPin[] => {
  const elementType = elementTypeFromElementIdSelector(state, elementId);
  if (elementType !== "pin-input" && elementType !== "pin-output") {
    return [];
  }

  const circuitId = circuitIdFromElementIdSelector(state, elementId);
  if (!circuitId) {
    return [];
  }

  const icElementType = circuitIdToElementType(circuitId);
  const icElementIds = elementIdsFromTypeSelector(state, icElementType);

  return icElementIds.map((icElementId) => ({
    elementId: icElementId,
    pinId: elementId,
  }));
};

export const pinNameFromElementPinSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string, pinId: string) => {
    const elementType = elementTypeFromElementIdSelector.local(
      state,
      elementId
    );
    const circuitId = elementTypeToCircuitId(elementType);
    if (circuitId) {
      // Pin id is the element id of the pin, look up it's name.
      return elementNameOrDefaultFromElementIdSelector.local(state, pinId);
    }

    return pinId;
  }
);
