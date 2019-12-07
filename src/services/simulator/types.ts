import { IDMap } from "@/types";

import { NodeType } from "./node-types";

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

export interface NodePinTransition {
  id: string;
  nodeId: string;
  outputId: string;
  tick: number;
  value: boolean;
}

export interface TransitionWindow {
  /**
   * The tick represented by this window.
   */
  tick: number;

  /**
   * The transitions contained in this window.
   */
  transitionIds: string[];
}
