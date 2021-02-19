import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";

import { createNodeGraphSelector } from "../utils";
import { NodeGraphServiceState } from "../state";
import { Node } from "../types";

export const nodesByNodeIdSelector = createNodeGraphSelector(
  (s) => s.nodesById
);

export const nodeIdsSelector = createNodeGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, Node>) => Object.keys(nodesById)
  )
);

export const nodeTypesByNodeIdSelector = createNodeGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, Node>) => mapValues(nodesById, (x) => x.nodeType)
  )
);

export const nodeFromNodeIdSelector = createNodeGraphSelector(
  (s: NodeGraphServiceState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeIdsFromTypeSelector = createNodeGraphSelector(
  (s: NodeGraphServiceState, desiredType: string) => {
    const nodeIds: string[] = [];
    for (const nodeId of Object.keys(s.nodesById)) {
      const { nodeType } = s.nodesById[nodeId];
      if (nodeType === desiredType) {
        nodeIds.push(nodeId);
      }
    }
    return nodeIds;
  }
);

export const nodeTypeFromNodeIdSelector = createNodeGraphSelector(
  (s: NodeGraphServiceState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.nodeType;
  }
);
