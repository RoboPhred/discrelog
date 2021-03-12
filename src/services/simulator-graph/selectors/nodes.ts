import { AppState } from "@/store";
import { ElementDefinitionsByType } from "@/elements";

import { getSimulatorNodeIdFromCircuitNodeIdPath } from "../utils";

import { rootNodeGraphSelector } from "./graph";

export const simulatorNodeIdsByCircuitNodeId = (state: AppState) =>
  rootNodeGraphSelector(state).simulatorNodeIdsByCircuitNodeId;

/**
 * Gets the simulator node id for a given circuit node id.
 */
export const simulatorNodeIdFromCircuitNodeIdSelector = (
  state: AppState,
  circuitNodeIdPath: string[]
) => {
  const { simulatorNodeIdsByCircuitNodeId } = rootNodeGraphSelector(state);
  return getSimulatorNodeIdFromCircuitNodeIdPath(
    simulatorNodeIdsByCircuitNodeId,
    circuitNodeIdPath
  );
};

/**
 * Get all simulator node ids.
 *
 * WARN: Not react safe.
 */
export const simulatorNodeIdsSelector = (state: AppState) => {
  const { simulatorNodesById } = rootNodeGraphSelector(state);
  return Object.keys(simulatorNodesById);
};

export const elementTypeFromSimulatorNodeId = (
  state: AppState,
  simulatorNodeId: string
) => {
  const { simulatorNodesById } = rootNodeGraphSelector(state);
  const simulatorNode = simulatorNodesById[simulatorNodeId];
  if (!simulatorNode) {
    return null;
  }

  return simulatorNode.elementType;
};

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
