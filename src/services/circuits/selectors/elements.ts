import { createCircuitsSelector } from "../utils";

export const elementIdsByCircuitIdSelector = createCircuitsSelector(
  (state) => state.elementIdsByCircuitId
);

export const elementIdsFromCircuitIdSelector = createCircuitsSelector<
  string,
  string[]
>((state, circuitId: string) => state.elementIdsByCircuitId[circuitId]);

export const circuitIdFromElementIdSelector = createCircuitsSelector<
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
