import flatMap from "lodash/flatMap";
import get from "lodash/get";

import {
  SimulatorNodeIdMappingTreeItem,
  SimulatorNodeIdToCircuitNodeIdMap,
} from "./types";

export function walkSimulatorNodeIdToCircuitNodeIdMap(
  map: SimulatorNodeIdToCircuitNodeIdMap,
  visit: (circuitNodeIdPath: string[], simulatorNodeId: string) => void,
  circuitNodeIdPath: string[] = []
) {
  const circuitNodeIds = Object.keys(map);
  for (const circuitNodeId of circuitNodeIds) {
    const { simulatorNodeId, subCircuitIds } = map[circuitNodeId];
    const currentPath = [...circuitNodeIdPath, circuitNodeId];
    if (simulatorNodeId) {
      visit(currentPath, simulatorNodeId);
    }
    walkSimulatorNodeIdToCircuitNodeIdMap(subCircuitIds, visit, currentPath);
  }
}

export function getSimulatorNodeIdFromCircuitNodeIdPath(
  map: SimulatorNodeIdToCircuitNodeIdMap,
  circuitNodeIdPath: string[]
): string | null {
  // Look up the path through the ic nodes to reach this node.
  const simulatorNodeIdPath = flatMap(circuitNodeIdPath, (icNodeId) => [
    icNodeId,
    "subCircuitIds",
  ]);

  // Remove the last subCircuitIds
  simulatorNodeIdPath.pop();

  const simulatorNodeIdItem: SimulatorNodeIdMappingTreeItem = get(
    map,
    simulatorNodeIdPath
  );

  if (!simulatorNodeIdItem) {
    return null;
  }

  const { simulatorNodeId } = simulatorNodeIdItem;
  return simulatorNodeId ?? null;
}
