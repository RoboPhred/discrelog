import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { NodeTypes, NodeType } from "@/node-defs";
import { IDMap } from "@/types";

import { createGraphSelector } from "../utils";
import { GraphState } from "../state";

import { NodePin, GraphNode } from "../types";

export const nodesByNodeIdSelector = createGraphSelector(s => s.nodesById);

export const nodeIdsSelector = createGraphSelector(
  createSelector(nodesByNodeIdSelector.local, (nodesById: IDMap<GraphNode>) =>
    Object.keys(nodesById)
  )
);

export const nodeTypesByNodeIdSelector = createGraphSelector(
  createSelector(nodesByNodeIdSelector.local, (nodesById: IDMap<GraphNode>) =>
    mapValues(nodesById, x => x.type)
  )
);

export const nodeDefsByNodeIdSelector = createGraphSelector(
  createSelector(
    nodeTypesByNodeIdSelector.local,
    (nodeTypesById: IDMap<NodeType>) =>
      mapValues(nodeTypesById, type => NodeTypes[type])
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
    return node.type;
  }
);

export const nodeDefFromNodeIdSelector = createGraphSelector(
  (s: GraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
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
