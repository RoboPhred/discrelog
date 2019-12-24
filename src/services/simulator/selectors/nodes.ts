import mapValues from "lodash/mapValues";

import { NodeTypes } from "@/node-defs";

import { SimulatorState } from "../state";
import { createSimulatorSelector } from "../utils";

// By-Id

export const nodesByIdSelector = createSimulatorSelector(s => s.nodesById);

export const nodeTypesByIdSelector = createSimulatorSelector(s =>
  mapValues(nodesByIdSelector.local(s), n => n.type)
);

export const nodeDefsByIdSelector = createSimulatorSelector(s =>
  mapValues(nodeTypesByIdSelector.local(s), type => NodeTypes[type] || null)
);

export const nodeStatesByIdSelector = createSimulatorSelector(
  s => s.nodeStatesByNodeId
);

export const nodeOutputValuesByNodeIdSelector = createSimulatorSelector(
  s => s.nodeOutputValuesByNodeId
);

// Per-Node

export const nodeSelector = createSimulatorSelector(
  (s: SimulatorState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeDefSelector = createSimulatorSelector(
  (s: SimulatorState, nodeId: string) => {
    const node = nodeSelector.local(s, nodeId);
    if (!node) {
      return null;
    }
    return NodeTypes[node.type] || null;
  }
);
