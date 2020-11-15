import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { ElementTypes, ElementType } from "@/element-defs";

import { createGraphSelector } from "../utils";
import { GraphState } from "../state";

import { NodePin, GraphNode } from "../types";

export const nodesByNodeIdSelector = createGraphSelector((s) => s.nodesById);

export const nodeIdsSelector = createGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, GraphNode>) => Object.keys(nodesById)
  )
);

export const nodeTypesByNodeIdSelector = createGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, GraphNode>) =>
      mapValues(nodesById, (x) => x.elementType)
  )
);

export const nodeDefsByNodeIdSelector = createGraphSelector(
  createSelector(
    nodeTypesByNodeIdSelector.local,
    (nodeTypesById: Record<string, ElementType>) =>
      mapValues(nodeTypesById, (type) => ElementTypes[type])
  )
);

export const nodeFromNodeIdSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeTypeFromNodeIdSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.elementType;
  }
);

export const nodeDefFromNodeIdSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return ElementTypes[node.elementType] || null;
  }
);

export const nodePinsSelector = createGraphSelector(
  createSelector(
    (s) => s.nodesById,
    (nodesById: Record<string, GraphNode>) =>
      values(nodesById).reduce((pins, node) => {
        const def = ElementTypes[node.elementType];
        if (def) {
          pins.push(
            ...Object.keys(def.pins).map((pin) => ({
              nodeId: node.id,
              pinId: pin,
            }))
          );
        }
        return pins;
      }, [] as NodePin[])
  )
);
