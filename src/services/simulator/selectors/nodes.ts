import { AppState } from "@/store";

import { getSimulatorNodeIdFromCircuitNodeIdPath } from "@/services/simulator-graph/utils";
import { rootNodeGraphSelector } from "@/services/simulator-graph/selectors/graph";

export const nodeStateFromCircuitNodeIdSelector = (
  state: AppState,
  circuitNodeIdPath: string[]
) => {
  const { simulatorNodeIdsByCircuitNodeId } = rootNodeGraphSelector(state);
  const nodeStatesBySimulatorNodeId =
    state.services.simulator.nodeStatesByNodeId;

  const simulatorNodeId = getSimulatorNodeIdFromCircuitNodeIdPath(
    simulatorNodeIdsByCircuitNodeId,
    circuitNodeIdPath
  );
  if (!simulatorNodeId) {
    return undefined;
  }

  return nodeStatesBySimulatorNodeId[simulatorNodeId];
};

export const nodeOutputsFromCircuitNodeIdSelector = (
  state: AppState,
  circuitNodeIdPath: string[]
) => {
  const { simulatorNodeIdsByCircuitNodeId } = rootNodeGraphSelector(state);
  const nodeOutputsBySimulatorNodeId =
    state.services.simulator.nodeOutputValuesByNodeId;

  const simulatorNodeId = getSimulatorNodeIdFromCircuitNodeIdPath(
    simulatorNodeIdsByCircuitNodeId,
    circuitNodeIdPath
  );
  if (!simulatorNodeId) {
    return undefined;
  }

  return nodeOutputsBySimulatorNodeId[simulatorNodeId];
};
