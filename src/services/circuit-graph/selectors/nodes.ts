import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { ElementDefinitionsByType, ElementType } from "@/element-defs";

import { createCircuitGraphSelector } from "../utils";
import { CircuitGraphState } from "../state";
import { NodePin, GraphNode } from "../types";

export const nodesByNodeIdSelector = createCircuitGraphSelector(
  (s) => s.nodesById
);

export const nodeIdsSelector = createCircuitGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, GraphNode>) => Object.keys(nodesById)
  )
);

export const elementTypesByNodeIdSelector = createCircuitGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, GraphNode>) =>
      mapValues(nodesById, (x) => x.elementType)
  )
);

export const elementDefsByNodeIdSelector = createCircuitGraphSelector(
  createSelector(
    elementTypesByNodeIdSelector.local,
    (nodeTypesById: Record<string, ElementType>) =>
      mapValues(nodeTypesById, (type) => ElementDefinitionsByType[type])
  )
);

export const nodeFromNodeIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const elementTypeFromNodeIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.elementType;
  }
);

export const elementDefFromNodeIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return ElementDefinitionsByType[node.elementType] || null;
  }
);

export const nodePinsSelector = createCircuitGraphSelector(
  createSelector(
    (s) => s.nodesById,
    (nodesById: Record<string, GraphNode>) =>
      values(nodesById).reduce((pins, node) => {
        const def = ElementDefinitionsByType[node.elementType];
        if (def) {
          pins.push(
            ...Object.keys(def.pins).map((pin) => ({
              nodeId: node.nodeId,
              pinId: pin,
            }))
          );
        }
        return pins;
      }, [] as NodePin[])
  )
);
