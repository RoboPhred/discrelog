import { createCircuitsSelector } from "../utils";

export const nodeIdsByCircuitIdSelector = createCircuitsSelector<
  string,
  string[]
>((state, circuitId: string) => state.nodeIdsByCircuitId[circuitId]);
