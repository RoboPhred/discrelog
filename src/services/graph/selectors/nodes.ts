import mapValues from "lodash/mapValues";

import { NodeTypes } from "@/node-defs";

import { createGraphSelector } from "../utils";
import { GraphState } from "../state";

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

export const nodeDefSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeByIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return NodeTypes[node.type] || null;
  }
);
