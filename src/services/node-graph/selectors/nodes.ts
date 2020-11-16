import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { ElementDefinitionsByType, ElementType } from "@/element-defs";

import { createGraphSelector } from "../utils";
import { NodeGraphState } from "../state";
import { NodePin, GraphNode } from "../types";

export const nodesByNodeIdSelector = createGraphSelector((s) => s.nodesById);

export const nodeIdsSelector = createGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, GraphNode>) => Object.keys(nodesById)
  )
);

export const elementTypesByNodeIdSelector = createGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, GraphNode>) =>
      mapValues(nodesById, (x) => x.elementType)
  )
);

export const elementDefsByNodeIdSelector = createGraphSelector(
  createSelector(
    elementTypesByNodeIdSelector.local,
    (nodeTypesById: Record<string, ElementType>) =>
      mapValues(nodeTypesById, (type) => ElementDefinitionsByType[type])
  )
);

export const nodeFromNodeIdSelector = createGraphSelector(
  (s: NodeGraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const elementTypeFromNodeIdSelector = createGraphSelector(
  (s: NodeGraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.elementType;
  }
);

export const elementDefFromNodeIdSelector = createGraphSelector(
  (s: NodeGraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return ElementDefinitionsByType[node.elementType] || null;
  }
);

export const nodePinsSelector = createGraphSelector(
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
