import find from "lodash/find";
import createCachedSelector from "re-reselect";

import { SimulatorState } from "../state";
import { NodePin } from "../types";

import { createSimulatorSelector } from "./utils";
import { nodeDefSelector } from "./nodes";

export const connectionsSelector = createSimulatorSelector(s => s.connections);

export const nodePinDirectionSelector = createSimulatorSelector(
  (s: SimulatorState, pin: NodePin) => {
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
export const nodeInputConnectionsByPinSelector = createSimulatorSelector(
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
 * Gets an object mapping output pin names to their connection target pins.
 */
export const nodeOutputConnectionsByPinSelector = createSimulatorSelector(
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
