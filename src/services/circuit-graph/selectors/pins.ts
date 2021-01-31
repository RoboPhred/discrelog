import { CircuitGraphState } from "../state";
import { NodePin } from "../types";
import { createCircuitGraphSelector } from "../utils";

import { connectionsSelector } from "./connections";
import { nodeDefFromNodeIdSelector } from "./nodes";

export const pinDirectionFromNodePinSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, nodeId: string, pinId: string) => {
    const def = nodeDefFromNodeIdSelector.local(s, nodeId);
    if (!def) {
      return null;
    }

    const pinDef = def.pins[pinId];
    if (!pinDef) {
      return null;
    }
    return pinDef.direction;
  }
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 *
 * WARN: Not react safe.  For reducer use only
 */
export const nodeOutputSourcesByPinIdFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) => {
    const connections = connectionsSelector.local(state);
    const nodeDef = nodeDefFromNodeIdSelector.local(state, nodeId);

    if (!nodeDef) {
      return {};
    }

    let outputPins: string[] = [];
    outputPins = Object.keys(nodeDef.pins).filter(
      (x) => nodeDef.pins[x].direction === "output"
    );

    const outputConnections = connections.filter(
      (x) => x.outputPin.nodeId === nodeId
    );

    const result: Record<string, NodePin[]> = {};
    for (const pin of outputPins) {
      result[pin] = [];
    }

    for (const connection of outputConnections) {
      const { outputPin, inputPin } = connection;
      result[outputPin.pinId].push(inputPin);
    }

    return result;
  }
);
