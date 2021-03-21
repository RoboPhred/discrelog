import * as yup from "yup";

export interface Element {
  /**
   * The type of this node.
   */
  elementType: string;

  /**
   * The user provided name of this node.
   */
  elementName: string | null;
}

/**
 * Identifies a pin on a specific node.
 */
export interface ElementPin {
  elementId: string;
  pinId: string;
}
export const elementPinSchema = yup.object().shape({
  elementId: yup.string().required().min(1),
  pinId: yup.string().required().min(1),
});
export function elementPinEquals(a: ElementPin, b: ElementPin) {
  return a.elementId === b.elementId && a.pinId === b.pinId;
}

/**
 * A connection from a node output to a node input.
 */
export interface Connection {
  /**
   * The output pin on a node, sending a value outwards.
   */
  outputPin: ElementPin;

  /**
   * The input pin on a node to receive the value.
   */
  inputPin: ElementPin;
}
