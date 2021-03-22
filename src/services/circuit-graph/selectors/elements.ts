import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";

import { createCircuitGraphSelector } from "../utils";
import { CircuitGraphServiceState } from "../state";
import { Element } from "../types";

export const elementsByElementIdSelector = createCircuitGraphSelector(
  (s) => s.elementsById
);

export const elementIdsSelector = createCircuitGraphSelector(
  createSelector(
    elementsByElementIdSelector.local,
    (elementsById: Record<string, Element>) => Object.keys(elementsById)
  )
);

export const elementTypesByElementIdSelector = createCircuitGraphSelector(
  createSelector(
    elementsByElementIdSelector.local,
    (elementsById: Record<string, Element>) =>
      mapValues(elementsById, (x) => x.elementType)
  )
);

export const elementFromElementIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, elementId: string) =>
    s.elementsById[elementId] || null
);

export const elementIdsFromTypeSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, desiredType: string) => {
    const elementIds: string[] = [];
    for (const elementId of Object.keys(s.elementsById)) {
      const { elementType } = s.elementsById[elementId];
      if (elementType === desiredType) {
        elementIds.push(elementId);
      }
    }
    return elementIds;
  }
);

export const elementTypeFromElementIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, elementId: string) => {
    const element = elementFromElementIdSelector.local(s, elementId);
    if (!element) {
      return null;
    }
    return element.elementType;
  }
);

export const elementIdsByCircuitIdSelector = createCircuitGraphSelector(
  (state) => state.elementIdsByCircuitId
);

const EmptyElementIds: string[] = [];
export const elementIdsFromCircuitIdSelector = createCircuitGraphSelector<
  string,
  string[]
>(
  (state, circuitId: string) =>
    state.elementIdsByCircuitId[circuitId] ?? EmptyElementIds
);

export const circuitIdFromElementIdSelector = createCircuitGraphSelector<
  string,
  string | null
>((state, elementId) => {
  for (const circuitId of Object.keys(state.elementIdsByCircuitId)) {
    const elementIds = state.elementIdsByCircuitId[circuitId];
    if (elementIds.indexOf(elementId) !== -1) {
      return circuitId;
    }
  }
  return null;
});

export const elementNamesByElementIdSelector = createCircuitGraphSelector(
  createSelector(
    (state) => state.elementsById,
    (elementsById) => {
      return mapValues(elementsById, (element) => element.elementName);
    }
  )
);

export const elementNameOrDefaultFromElementIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, elementId: string) => {
    const element = elementFromElementIdSelector.local(s, elementId);
    if (!element) {
      return null;
    }

    return element.elementName ?? elementId.substr(0, 4);
  }
);

export const elementNameFromElementIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, elementId: string) => {
    const element = elementFromElementIdSelector.local(s, elementId);
    if (!element) {
      return null;
    }

    return element.elementName;
  }
);
