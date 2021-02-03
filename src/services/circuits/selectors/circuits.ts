import { createCircuitsSelector } from "../utils";

export const circuitNamesByIdSelector = createCircuitsSelector(
  (state) => state.circuitNamesByCircuitId
);
