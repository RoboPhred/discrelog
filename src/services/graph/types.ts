import { NodeType } from "@/node-defs";
import { IDMap } from "@/types";

export interface Node {
  id: string;
  type: NodeType;
}

export type NodesById = IDMap<Node>;

/**
 * Identifies a pin on a specific node.
 */
export interface NodePin {
  nodeId: string;
  pinId: string;
}
export function nodePinEquals(a: NodePin, b: NodePin) {
  return a.nodeId === b.nodeId && a.pinId === b.pinId;
}

/**
 * A connection from a node input to a node output.
 */
export interface Connection {
  outputPin: NodePin;
  inputPin: NodePin;
}

export type PinValueMap = IDMap<boolean>;
