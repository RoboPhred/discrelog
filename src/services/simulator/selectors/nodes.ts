import { AppState } from "@/store";

import { getSimulatorNodeIdFromCircuitNodeIdPath } from "@/services/simulator-graph/utils";

export const nodeStateFromCircuitNodeIdSelector = (
  state: AppState,
  circuitNodeIdPath: string[]
) => {
  const simulatorNodeIdsByCircuitNodeId =
    state.services.simulatorGraph.simulatorNodeIdsByCircuitNodeId;
  const nodeStatesBySimulatorNodeId =
    state.services.simulator.nodeStatesByNodeId;

  const simulatorNodeId = getSimulatorNodeIdFromCircuitNodeIdPath(
    simulatorNodeIdsByCircuitNodeId,
    circuitNodeIdPath
  );
  if (!simulatorNodeId) {
    return {};
  }

  return nodeStatesBySimulatorNodeId[simulatorNodeId];
};
