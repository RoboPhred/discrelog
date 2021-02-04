import { createCircuitsSelector } from "../utils";

export const nodeIdsByCircuitIdSelector = createCircuitsSelector<
  string,
  string[]
>((state, circuitId: string) => state.nodeIdsByCircuitId[circuitId]);

export const circuitIdFromNodeIdSelector = createCircuitsSelector<
  string,
  string | null
>((state, nodeId) => {
  for (const circuitId of Object.keys(state.nodeIdsByCircuitId)) {
    const nodeIds = state.nodeIdsByCircuitId[circuitId];
    if (nodeIds.indexOf(nodeId) !== -1) {
      return circuitId;
    }
  }
  return null;
});
