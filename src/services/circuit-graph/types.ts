import * as yup from "yup";

import { NodeType } from "@/nodes";

export interface Node {
  nodeType: NodeType;
}

/**
 * Identifies a pin on a specific node.
 */
export interface NodePin {
  nodeId: string;
  pinId: string;
}
export const nodePinSchema = yup.object().shape({
  nodeId: yup.string().required().min(1),
  pinId: yup.string().required().min(1),
});
export function nodePinEquals(a: NodePin, b: NodePin) {
  return a.nodeId === b.nodeId && a.pinId === b.pinId;
}

/**
 * A connection from a node output to a node input.
 */
export interface Connection {
  outputPin: NodePin;
  inputPin: NodePin;
}
