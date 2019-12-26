import find from "lodash/find";
import createCachedSelector from "re-reselect";

import { NodePin } from "../types";

import { GraphState } from "../state";
import { createGraphSelector } from "../utils";

import { nodeDefSelector } from "./nodes";

export const connectionsSelector = createGraphSelector(s => s.connections);

export const nodePinDirectionSelector = createGraphSelector(
  (s: GraphState, pin: NodePin) => {
    const def = nodeDefSelector.local(s, pin.nodeId);
    if (!def) {
      return null;
    }

    const pinDef = find(def.pins, p => p.name === pin.pinId);
    if (!pinDef) {
      return null;
    }
    return pinDef.direction;
  }
);

/**
 * Gets an object mapping input pin names to their connection source pins.
 */
export const nodeInputConnectionsByPinSelector = createGraphSelector(
  createCachedSelector(
    connectionsSelector.local,
    (_: any, nodeId: string) => nodeId,
    nodeDefSelector.local,
    (connections, nodeId, nodeDef) => {
      if (!nodeDef) {
        return {};
      }

      let inputPins: string[] = [];
      inputPins = Object.keys(nodeDef.pins).filter(
        x => nodeDef.pins[x].direction === "input"
      );

      const inputConnections = connections.filter(
        x => x.inputPin.nodeId === nodeId
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
 * Gets an array of outgoing connections from the given node id.
 */
export const nodeOutputConnectionsSelector = createGraphSelector(
  (state: GraphState, nodeId: string) =>
    state.connections.filter(x => x.outputPin.nodeId === nodeId)
);

/**
 * Gets an object mapping output pin names to their connection target pins.
 */
export const nodeOutputConnectionsByPinSelector = createGraphSelector(
  createCachedSelector(
    connectionsSelector.local,
    (_: any, nodeId: string) => nodeId,
    nodeDefSelector.local,
    (connections, nodeId, nodeDef) => {
      if (!nodeDef) {
        return {};
      }

      let outputPins: string[] = [];
      outputPins = Object.keys(nodeDef.pins).filter(
        x => nodeDef.pins[x].direction === "output"
      );

      const outputConnections = connections.filter(
        x => x.outputPin.nodeId === nodeId
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
