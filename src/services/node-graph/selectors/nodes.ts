import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";

import { AppState } from "@/store";

import { createNodeGraphSelector } from "../utils";
import { NodeGraphState } from "../state";
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
  (s: NodeGraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeTypeFromNodeIdSelector = createNodeGraphSelector(
  (s: NodeGraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.nodeType;
  }
);
