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

export interface Wire {
  wireSegmentIds: string[];
}

/**
 * Defines a segment that passes a value into an element from the wire.
 */
export interface InputWireSegment {
  type: "input";

  /**
   * The input pin we supply a value to.
   */
  inputPin: ElementPin;

  /**
   * The joint id on the non-pin side of this segment.
   */
  jointId: string;

  /**
   * The id of the line in the wire, used to match against the source output.
   */
  lineId: string;
}

/**
 * Defines a wire segment that pulls a value into the wire.
 */
export interface OutputWireSegment {
  type: "output";

  /**
   * The output pin we take our value from.
   */
  outputPin: ElementPin;

  /**
   * The joint id of the non-pin side of this segment.
   */
  jointId: string;

  /**
   * The id of the line in the wire, used to match against inputs.
   */
  lineId: string;
}

/**
 * Defines a wire segment that directly connects an input to an output.
 *
 * This is a special case where a wire goes directly between two elements with no
 * additional inputs or outputs.
 */
export interface InputOutputWireSegment {
  type: "input-output";
  /**
   * The output pin supplying the value.
   */
  outputPin: ElementPin;
  /**
   * The input pin where the value is supplied.
   */
  inputPin: ElementPin;
}

/**
 * Defines a wire segment that bridges two other segments.
 */
export interface BridgeWireSegment {
  type: "bridge";
  /**
   * The first joint in the bridge.
   */
  jointAId: string;

  /**
   * The second joint in the bridge.
   */
  jointBId: string;
}

export type WireSegment =
  | InputWireSegment
  | OutputWireSegment
  | InputOutputWireSegment
  | BridgeWireSegment;

export function isOutputWireSegment(
  segment: WireSegment
): segment is OutputWireSegment {
  return segment.type === "output";
}

export function isInputWireSegment(
  segment: WireSegment
): segment is InputWireSegment {
  return segment.type === "input";
}

export function isInputOutputWireSegment(
  segment: WireSegment
): segment is InputOutputWireSegment {
  return segment.type === "input-output";
}

export function wireSegmentHasInput(
  segment: WireSegment
): segment is InputWireSegment | InputOutputWireSegment {
  return segment.type === "input" || segment.type === "input-output";
}
