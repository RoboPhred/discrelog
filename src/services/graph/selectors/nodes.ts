import mapValues from "lodash/mapValues";

import { NodeTypes } from "@/node-defs";

import { createGraphSelector } from "../utils";
import { GraphState } from "../state";

export const nodesByIdSelector = createGraphSelector(s => s.nodesById);

export const nodeTypesByIdSelector = createGraphSelector(s =>
  mapValues(nodesByIdSelector.local(s), n => n.type)
);

export const nodeDefsByIdSelector = createGraphSelector(s =>
  mapValues(nodeTypesByIdSelector.local(s), type => NodeTypes[type] || null)
);

export const nodeSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeDefSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return NodeTypes[node.type] || null;
  }
);
