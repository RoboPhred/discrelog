import { AppState } from "@/store";

import { circuitIdToElementType } from "@/elements/definitions/integrated-circuits/utils";

import { CircuitsServiceState } from "../state";
import { createCircuitsSelector } from "../utils";

export const circuitIdsSelector = createCircuitsSelector((state) =>
  Object.keys(state.circuitNamesByCircuitId)
);

export const circuitNamesByIdSelector = createCircuitsSelector(
  (state) => state.circuitNamesByCircuitId
);

export const circuitNameFromIdSelector = createCircuitsSelector(
  (state: CircuitsServiceState, circuitId: string) =>
    state.circuitNamesByCircuitId[circuitId]
);

const circuitIdForElementIdSelector = createCircuitsSelector(
  (state: CircuitsServiceState, elementId: string) => {
    const { elementIdsByCircuitId } = state;
    const circuitIds = Object.keys(elementIdsByCircuitId);
    for (const circuitId of circuitIds) {
      if (elementIdsByCircuitId[circuitId].indexOf(elementId) !== -1) {
        return circuitId;
      }
    }
    return null;
  }
);

export const circuitWouldRecurseSelector = (
  state: AppState,
  circuitId: string | null,
  targetCircuitId: string
): boolean => {
  if (!circuitId) {
    return false;
  }
  if (circuitId === targetCircuitId) {
    return true;
  }

  const targetCircuitNodeType = circuitIdToElementType(targetCircuitId);
  const { elementsById } = state.services.elementGraph;
  const targetCircuitElementIds = Object.keys(elementsById).filter(
    (elementId) => elementsById[elementId].elementType === targetCircuitNodeType
  );

  return targetCircuitElementIds.some((elementId) => {
    const targetContainingCircuitId = circuitIdForElementIdSelector(
      state,
      elementId
    );
    if (!targetContainingCircuitId) {
      return false;
    }
    return circuitWouldRecurseSelector(
      state,
      circuitId,
      targetContainingCircuitId
    );
  });
};
