import { CircuitsState } from "../state";
import { createCircuitsSelector } from "../utils";

export const circuitIdsSelector = createCircuitsSelector((state) =>
  Object.keys(state.circuitNamesByCircuitId)
);

export const circuitNamesByIdSelector = createCircuitsSelector(
  (state) => state.circuitNamesByCircuitId
);

export const circuitNameFromIdSelector = createCircuitsSelector(
  (state: CircuitsState, circuitId: string) =>
    state.circuitNamesByCircuitId[circuitId]
);
