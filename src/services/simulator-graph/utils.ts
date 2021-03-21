import flatMap from "lodash/flatMap";
import get from "lodash/get";

import { EvolverIdMappingTreeItem, EvolverIdToElementIdMap } from "./types";

export function walkSimulatorElementIdToCircuitElementIdMap(
  map: EvolverIdToElementIdMap,
  visit: (elementIdPath: string[], evolverId: string) => void,
  elementIdPath: string[] = []
) {
  const elementIds = Object.keys(map);
  for (const elementId of elementIds) {
    const { evolverId, subElementIds: subCircuitIds } = map[elementId];
    const currentPath = [...elementIdPath, elementId];
    if (evolverId) {
      visit(currentPath, evolverId);
    }
    walkSimulatorElementIdToCircuitElementIdMap(
      subCircuitIds,
      visit,
      currentPath
    );
  }
}

export function getEvolverIdFromElementIdPath(
  map: EvolverIdToElementIdMap,
  elementIdPath: string[]
): string | null {
  // Look up the path through the ic element to reach this element.
  const evolverIdPath = flatMap(elementIdPath, (icElementId) => [
    icElementId,
    "subElementIds",
  ]);

  // Remove the last subCircuitIds
  evolverIdPath.pop();

  const evolverIdItem: EvolverIdMappingTreeItem = get(map, evolverIdPath);

  if (!evolverIdItem) {
    return null;
  }

  const { evolverId: evolverId } = evolverIdItem;
  return evolverId ?? null;
}
