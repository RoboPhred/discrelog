export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle {
  p1: Point;
  p2: Point;
}

export interface IDMap<T> {
  [key: string]: T;
}

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
