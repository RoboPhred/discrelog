import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";

import { createElementGraphSelector } from "../utils";
import { ElementGraphServiceState } from "../state";
import { Element } from "../types";

export const elementsByElementIdSelector = createElementGraphSelector(
  (s) => s.elementsById
);

export const elementIdsSelector = createElementGraphSelector(
  createSelector(
    elementsByElementIdSelector.local,
    (elementsById: Record<string, Element>) => Object.keys(elementsById)
  )
);

export const elementTypesByElementIdSelector = createElementGraphSelector(
  createSelector(
    elementsByElementIdSelector.local,
    (elementsById: Record<string, Element>) =>
      mapValues(elementsById, (x) => x.elementType)
  )
);

export const elementFromElementIdSelector = createElementGraphSelector(
  (s: ElementGraphServiceState, elementId: string) =>
    s.elementsById[elementId] || null
);

export const elementIdsFromTypeSelector = createElementGraphSelector(
  (s: ElementGraphServiceState, desiredType: string) => {
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

export const elementTypeFromElementIdSelector = createElementGraphSelector(
  (s: ElementGraphServiceState, elementId: string) => {
    const element = elementFromElementIdSelector.local(s, elementId);
    if (!element) {
      return null;
    }
    return element.elementType;
  }
);

export const elementNamesByElementIdSelector = createElementGraphSelector(
  createSelector(
    (state) => state.elementsById,
    (elementsById) => {
      return mapValues(elementsById, (element) => element.elementName);
    }
  )
);

export const elementNameOrDefaultFromElementIdSelector = createElementGraphSelector(
  (s: ElementGraphServiceState, elementId: string) => {
    const element = elementFromElementIdSelector.local(s, elementId);
    if (!element) {
      return null;
    }

    return element.elementName ?? elementId.substr(0, 4);
  }
);

export const elementNameFromElementIdSelector = createElementGraphSelector(
  (s: ElementGraphServiceState, elementId: string) => {
    const element = elementFromElementIdSelector.local(s, elementId);
    if (!element) {
      return null;
    }

    return element.elementName;
  }
);
