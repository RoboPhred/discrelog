import find from "lodash/find";

import { SimulatorState } from "../state";
import { NodePin, Connection } from "../types";
import { NodeTypes } from "../node-types";

/**
 * Check two pins to see if they can form a valid connection.
 * Returns null if no connection can be made (both inputs or both outputs)
 *
 * Does not check to see if the pins are already connected, or other connections prevent this connection from forming.
 */
export function pinsToConnection(
  state: SimulatorState,
  p1: NodePin,
  p2: NodePin
): Connection | null {
  const p1Node = state.nodesById[p1.nodeId];
  const p2Node = state.nodesById[p2.nodeId];

  if (!p1Node || !p2Node) {
    return null;
  }

  const p1Def = NodeTypes[p1Node.type];
  const p2Def = NodeTypes[p2Node.type];

  if (!p1Def || !p2Def) {
    return null;
  }

  const p1Pin = find(p1Def.pins, x => x.name == p1.pinId);
  const p2Pin = find(p2Def.pins, x => x.name == p2.pinId);

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
    inputPin
  };
}
