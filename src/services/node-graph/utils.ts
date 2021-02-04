import { AppState } from "@/store";

import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";

import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

import { NodeGraphState } from "./state";
import { NodePin, Connection } from "./types";

export const createNodeGraphReducer = createServiceReducerCreator("nodeGraph");
export const createNodeGraphSelector = createServiceSelectorCreator(
  "nodeGraph"
);

/**
 * Check two pins to see if they can form a valid connection.
 * Returns null if no connection can be made (both inputs or both outputs)
 *
 * Does not check to see if the pins are already connected, or other connections prevent this connection from forming.
 */
export function pinsToConnection(
  state: NodeGraphState,
  p1: NodePin,
  p2: NodePin,
  rootState: AppState
): Connection | null {
  const p1Node = state.nodesById[p1.nodeId];
  const p2Node = state.nodesById[p2.nodeId];

  if (!p1Node || !p2Node) {
    return null;
  }

  const p1Def = nodeDefinitionFromTypeSelector(rootState, p1Node.nodeType);
  const p2Def = nodeDefinitionFromTypeSelector(rootState, p2Node.nodeType);

  if (!p1Def || !p2Def) {
    return null;
  }

  const p1Pin = p1Def.pins[p1.pinId];
  const p2Pin = p2Def.pins[p2.pinId];

  if (!p1Pin || !p2Pin) {
    return null;
  }

  // Pins are in same direction and cannot be connected.
  if (p1Pin.direction === p2Pin.direction) {
    return null;
  }

  const outputPin = p1Pin.direction === "output" ? p1 : p2;
  const inputPin = p1Pin.direction === "input" ? p1 : p2;

  return {
    outputPin,
    inputPin,
  };
}
