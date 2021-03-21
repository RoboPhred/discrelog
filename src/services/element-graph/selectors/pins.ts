import { circuitIdFromElementIdSelector } from "@/services/circuits/selectors/elements";
import { circuitIdToElementType } from "@/elements/definitions/integrated-circuits/utils";
import { AppState } from "@/store";

import { ElementPin } from "../types";

import { connectionsSelector } from "./connections";
import { elementDefinitionFromElementIdSelector } from "./element-def";
import {
  elementIdsFromTypeSelector,
  elementTypeFromElementIdSelector,
} from "./elements";

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
 * Gets a map of node input pins to their output sources given a node id.
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
