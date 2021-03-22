import * as yup from "yup";

export interface Element {
  /**
   * The type of this element.
   */
  elementType: string;

  /**
   * The user provided name of this element.
   */
  elementName: string | null;
}

/**
 * Identifies a pin on a specific element.
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
 * A connection from an element output to an element input.
 */
export interface ElementConnection {
  /**
   * The output pin on an element, sending a value outwards.
   */
  outputPin: ElementPin;

  /**
   * The input pin on an element to receive the value.
   */
  inputPin: ElementPin;
}
