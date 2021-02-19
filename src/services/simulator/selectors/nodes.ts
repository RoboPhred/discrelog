import { AppState } from "@/store";

import { createSimulatorSelector } from "../utils";
import { SimulatorServiceState } from "../state";

export const nodeStatesByNodeIdSelector = (function () {
  let cachedSimulatorNodeIdsByCircuitNodeId: any;
  let cachedNodeStatesBySimulatorNodeId: any;
  let cachedNodeStatesByNodeIdSelector: Record<string, any> | null = null;

  return (state: AppState) => {
    const simulatorNodeIdsByCircuitNodeId =
      state.services.simulatorGraph.simulatorNodeIdsByCircuitNodeId;
    const nodeStatesBySimulatorNodeId =
      state.services.simulator.nodeStatesByNodeId;

    if (
      cachedSimulatorNodeIdsByCircuitNodeId ===
        simulatorNodeIdsByCircuitNodeId &&
      cachedNodeStatesBySimulatorNodeId === nodeStatesBySimulatorNodeId &&
      cachedNodeStatesByNodeIdSelector != null
    ) {
      return cachedNodeStatesByNodeIdSelector;
    }

    const nodeStatesByNodeId: Record<string, any> = {};

    for (const circuitNodeId of Object.keys(simulatorNodeIdsByCircuitNodeId)) {
      const simulatorNodeId = simulatorNodeIdsByCircuitNodeId[circuitNodeId];
      nodeStatesByNodeId[circuitNodeId] =
        nodeStatesBySimulatorNodeId[simulatorNodeId];
    }

    cachedSimulatorNodeIdsByCircuitNodeId = simulatorNodeIdsByCircuitNodeId;
    cachedNodeStatesBySimulatorNodeId = nodeStatesBySimulatorNodeId;
    cachedNodeStatesByNodeIdSelector = nodeStatesByNodeId;
    return nodeStatesByNodeId;
  };
})();

export const nodeStateFromNodeIdSelector = (
  state: AppState,
  nodeId: string
) => {
  const simulatorNodeIdsByCircuitNodeId =
    state.services.simulatorGraph.simulatorNodeIdsByCircuitNodeId;
  const nodeStatesBySimulatorNodeId =
    state.services.simulator.nodeStatesByNodeId;

  const simulatorNodeId = simulatorNodeIdsByCircuitNodeId[nodeId];
  if (!simulatorNodeId) {
    return {};
  }

  return nodeStatesBySimulatorNodeId[simulatorNodeId];
};
