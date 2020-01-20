import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { NodeTypes } from "@/node-defs";
import { IDMap } from "@/types";

import { createGraphSelector } from "../utils";
import { GraphState } from "../state";

import { NodePin, GraphNode } from "../types";

export const nodesByIdSelector = createGraphSelector(s => s.nodesById);
export const nodeIdsSelector = createGraphSelector(s =>
  Object.keys(s.nodesById)
);

export const nodeTypesByIdSelector = createGraphSelector(s =>
  mapValues(nodesByIdSelector.local(s), n => n.type)
);

export const nodeDefsByIdSelector = createGraphSelector(s =>
  mapValues(nodeTypesByIdSelector.local(s), type => NodeTypes[type] || null)
);

export const nodeByIdSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeTypeSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeByIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.type;
  }
);

export const nodeDefByNodeIdSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeByIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return NodeTypes[node.type] || null;
  }
);

export const nodePinsSelector = createGraphSelector(
  createSelector(
    s => s.nodesById,
    (nodesById: IDMap<GraphNode>) =>
      values(nodesById).reduce((pins, node) => {
        const def = NodeTypes[node.type];
        if (def) {
          pins.push(
            ...Object.keys(def.pins).map(pin => ({
              nodeId: node.id,
              pinId: pin
            }))
          );
        }
        return pins;
      }, [] as NodePin[])
  )
);
