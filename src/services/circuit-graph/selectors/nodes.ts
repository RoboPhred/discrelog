import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";

import { NodeDefinitionsByType } from "@/nodes";

import { createCircuitGraphSelector } from "../utils";
import { CircuitGraphState } from "../state";
import { Node } from "../types";

export const nodesByNodeIdSelector = createCircuitGraphSelector(
  (s) => s.nodesById
);

export const nodeIdsSelector = createCircuitGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, Node>) => Object.keys(nodesById)
  )
);

export const nodeTypesByNodeIdSelector = createCircuitGraphSelector(
  createSelector(
    nodesByNodeIdSelector.local,
    (nodesById: Record<string, Node>) => mapValues(nodesById, (x) => x.nodeType)
  )
);

export const nodeFromNodeIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeTypeFromNodeIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string) => {
    const node = nodeFromNodeIdSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return node.nodeType;
  }
);

export const nodeDefFromNodeIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string) => {
    const nodeType = nodeTypeFromNodeIdSelector.local(s, nodeId);
    if (!nodeType) {
      return null;
    }

    const def = NodeDefinitionsByType[nodeType];
    return def;
  }
);
