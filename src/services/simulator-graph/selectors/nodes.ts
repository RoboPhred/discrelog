import { AppState } from "@/store";

import { NodeDefinitionsByType } from "@/nodes";

export const simulatorNodeIdFromCircuitNodeIdSelector = (
  state: AppState,
  circuitNodeId: string
) => circuitNodeId;

export const simulatorNodeIdsSelector = (state: AppState) =>
  Object.keys(state.services.circuitGraph.nodesById);

export const elementTypeFromSimulatorNodeId = (
  state: AppState,
  simNodeId: string
) => {
  const nodeType =
    state.services.circuitGraph.nodesById[simNodeId]?.nodeType ?? null;
  if (!nodeType) {
    return null;
  }
  return NodeDefinitionsByType[nodeType].elementType;
};
