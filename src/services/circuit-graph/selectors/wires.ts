import find from "lodash/find";
import values from "lodash/values";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

import { NodePin } from "../types";

import { CircuitGraphState } from "../state";
import { createCircuitGraphSelector } from "../utils";

import { elementDefFromNodeIdSelector, nodePinsSelector } from "./nodes";
import mapValues from "lodash/mapValues";

export const wireIdsSelector = createCircuitGraphSelector(
  createSelector(
    (s) => s.wiresById,
    (wiresById) => Object.keys(wiresById)
  )
);

export const wireFromWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphState, wireId: string) => s.wiresById[wireId]
);

const wiresSelector = createCircuitGraphSelector(
  createSelector(
    (state: CircuitGraphState) => state.wiresById,
    (wiresById) => values(wiresById)
  )
);

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
 * Gets all wire ids supplying input to the specified node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeInputWireIdsFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) =>
    Object.keys(state.wiresById).filter(
      (wireId) => state.wiresById[wireId].inputPin.nodeId === nodeId
    )
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const nodeInputSourcesByPinIdFromNodeIdSelector = createCircuitGraphSelector(
  createCachedSelector(
    wiresSelector.local,
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
 * Gets an array of wires leaving the given node id.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeOutputWiresFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) =>
    wiresSelector.local(state).filter((x) => x.outputPin.nodeId === nodeId)
);

/**
 * Gets an array of wire ids leaving the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeOutputWireIdsFromNodeIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphState, nodeId: string) =>
    Object.keys(state.wiresById).filter(
      (wireId) => state.wiresById[wireId].outputPin.nodeId === nodeId
    )
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const nodeOutputSourcesByPinIdFromNodeIdSelector = createCircuitGraphSelector(
  createCachedSelector(
    wiresSelector.local,
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
