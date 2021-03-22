import { AppState } from "@/store";

import { circuitIdToElementType } from "@/elements/definitions/integrated-circuits/utils";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";

const circuitIdForElementIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string) => {
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
  const { elementsById } = state.services.circuitGraph;
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
