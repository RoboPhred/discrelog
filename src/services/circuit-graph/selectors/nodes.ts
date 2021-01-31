import { createSelector } from "reselect";
import mapValues from "lodash/mapValues";

import { NodeDefinitionsByType } from "@/nodes";

import { createCircuitGraphSelector } from "../utils";
import { CircuitGraphState } from "../state";
import { NodePin, Node } from "../types";

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

export const nodePinsSelector = createCircuitGraphSelector(
  createSelector(
    (s) => s.nodesById,
    (nodesById: Record<string, Node>) => {
      const pins: NodePin[] = [];
      for (const nodeId of Object.keys(nodesById)) {
        const node = nodesById[nodeId];
        const def = NodeDefinitionsByType[node.nodeType];
        if (def) {
          pins.push(
            ...Object.keys(def.pins).map((pin) => ({
              nodeId: nodeId,
              pinId: pin,
            }))
          );
        }
      }
      return pins;
    }
  )
);
