import { AppState } from "@/store";
import { ElementDefinitionsByType } from "@/elements";

import {
  createSimulatorGraphSelector,
  getSimulatorNodeIdFromCircuitNodeIdPath,
} from "../utils";
import { SimulatorGraphServiceState } from "../state";

export const simulatorNodeIdFromCircuitNodeIdSelector = createSimulatorGraphSelector(
  (state: SimulatorGraphServiceState, circuitNodeIdPath: string[]) => {
    return getSimulatorNodeIdFromCircuitNodeIdPath(
      state.simulatorNodeIdsByCircuitNodeId,
      circuitNodeIdPath
    );
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
  (state: SimulatorGraphServiceState, simulatorNodeId: string) => {
    const simulatorNode = state.simulatorNodesById[simulatorNodeId];
    if (!simulatorNode) {
      return null;
    }

    return simulatorNode.elementType;
  }
);

export const elementDefFromSimulatorNodeId = (
  state: AppState,
  nodeId: string
) => {
  const type = elementTypeFromSimulatorNodeId(state, nodeId);
  if (!type) {
    return null;
  }

  return ElementDefinitionsByType[type] ?? null;
};
