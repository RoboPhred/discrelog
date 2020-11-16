import { AppState } from "@/store";

export const simulatorNodeIdsSelector = (state: AppState) =>
  Object.keys(state.services.circuitGraph.nodesById);

export const elementTypeFromSimulatorNodeId = (
  state: AppState,
  simNodeId: string
) => state.services.circuitGraph.nodesById[simNodeId]?.elementType ?? null;
