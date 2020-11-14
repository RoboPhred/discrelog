import find from "lodash/find";
import values from "lodash/values";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

import { NodePin } from "../types";

import { GraphState } from "../state";
import { createGraphSelector } from "../utils";

import { nodeDefFromNodeIdSelector, nodePinsSelector } from "./nodes";
import mapValues from "lodash/mapValues";

export const wireIdsSelector = createGraphSelector(
  createSelector(
    (s) => s.wiresById,
    (wiresById) => Object.keys(wiresById)
  )
);

export const wireFromWireIdSelector = createGraphSelector(
  (s: GraphState, wireId: string) => s.wiresById[wireId]
);

const wiresSelector = createGraphSelector(
  createSelector(
    (state: GraphState) => state.wiresById,
    (wiresById) => values(wiresById)
  )
);

export const nodePinDirectionSelector = createGraphSelector(
  (s: GraphState, pin: NodePin) => {
    const def = nodeDefFromNodeIdSelector.local(s, pin.nodeId);
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
export const nodeInputWireIdsFromNodeIdSelector = createGraphSelector(
  (state: GraphState, nodeId: string) =>
    Object.keys(state.wiresById).filter(
      (wireId) => state.wiresById[wireId].inputPin.nodeId === nodeId
    )
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const nodeInputSourcesByPinIdFromNodeIdSelector = createGraphSelector(
  createCachedSelector(
    wiresSelector.local,
    (_: any, nodeId: string) => nodeId,
    nodeDefFromNodeIdSelector.local,
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
export const nodeOutputWiresFromNodeIdSelector = createGraphSelector(
  (state: GraphState, nodeId: string) =>
    wiresSelector.local(state).filter((x) => x.outputPin.nodeId === nodeId)
);

/**
 * Gets an array of wire ids leaving the given node.
 * WARN: Not react safe.  For reducer use only.
 */
export const nodeOutputWireIdsFromNodeIdSelector = createGraphSelector(
  (state: GraphState, nodeId: string) =>
    Object.keys(state.wiresById).filter(
      (wireId) => state.wiresById[wireId].outputPin.nodeId === nodeId
    )
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const nodeOutputSourcesByPinIdFromNodeIdSelector = createGraphSelector(
  createCachedSelector(
    wiresSelector.local,
    (_: any, nodeId: string) => nodeId,
    nodeDefFromNodeIdSelector.local,
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
