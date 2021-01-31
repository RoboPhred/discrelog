import { createSimulatorGraphSelector } from "../utils";
import { SimulatorGraphState } from "../state";

export const simulatorNodeIdFromCircuitNodeIdSelector = createSimulatorGraphSelector(
  (state: SimulatorGraphState, circuitNodeId: string) => {
    return state.simulatorNodeIdsByCircuitNodeId[circuitNodeId];
  }
);

/**
 * Get all simulator node ids.
 *
 * WARN: Not react safe.
 */
export const simulatorNodeIdsSelector = createSimulatorGraphSelector((state) =>
  Object.keys(state.simulatorNodesById)
);

export const elementTypeFromSimulatorNodeId = createSimulatorGraphSelector(
  (state: SimulatorGraphState, simulatorNodeId: string) => {
    const simulatorNode = state.simulatorNodesById[simulatorNodeId];
    if (!simulatorNode) {
      return null;
    }

    return simulatorNode.elementType;
  }
);
