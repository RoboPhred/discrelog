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
 */
export const nodeInputSourcesByPinIdFromNodeIdSelector = createCircuitGraphSelector(
  createCachedSelector(
    connectionsSelector.local,
    (_: any, nodeId: string) => nodeId,
    elementDefFromNodeIdSelector.local,
    (connections, nodeId, nodeDef) => {
      if (!nodeDef) {
        return {};
      }

      let inputPins: string[] = [];
      inputPins = Object.keys(nodeDef.pins).filter(
        (x) => nodeDef.pins[x].direction === "input"
      );

      const inputConnections = connections.filter(
        (x) => x.inputPin.nodeId === nodeId
      );

      const result: Record<string, NodePin | null> = {};
      for (const pin of inputPins) {
        result[pin] = null;
      }

      for (const connection of inputConnections) {
        const { outputPin, inputPin } = connection;
        result[inputPin.pinId] = outputPin;
      }

      return result;
    }
  )((_: any, nodeId: string) => nodeId)
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const nodeOutputSourcesByPinIdFromNodeIdSelector = createCircuitGraphSelector(
  createCachedSelector(
    connectionsSelector.local,
    (_: any, nodeId: string) => nodeId,
    elementDefFromNodeIdSelector.local,
    (connections, nodeId, nodeDef) => {
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
  )((_: any, nodeId: string) => nodeId)
);
