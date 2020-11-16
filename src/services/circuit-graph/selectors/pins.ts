import find from "lodash/find";
import createCachedSelector from "re-reselect";

import { CircuitGraphState } from "../state";
import { NodePin } from "../types";
import { createCircuitGraphSelector } from "../utils";

import { connectionsSelector } from "./connections";
import { elementDefFromNodeIdSelector } from "./nodes";

export const nodePinDirectionSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, pin: NodePin) => {
    const def = elementDefFromNodeIdSelector.local(s, pin.nodeId);
    if (!def) {
      return null;
    }

    const pinDef = find(def.pins, (p) => p.name === pin.pinId);
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
    const nodeDef = elementDefFromNodeIdSelector.local(state, nodeId);

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
