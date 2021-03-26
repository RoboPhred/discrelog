import { Point } from "@/geometry";
import { ElementPin } from "../circuit-graph/types";

/**
 * Defines a drag target that is targeting an element pin.
 * The input or output status is checked by determining what direction
 * the targeted pin is.
 */
export interface CircuitEditorDragWirePinTarget {
  type: "pin";

  /**
   * The pin this drag event is targeting.
   */
  pin: ElementPin;
}

/**
 * Defines a drag target where the start or end of a wire drag
 * desires to be attached to an existing wire segment.
 */
export interface CircuitEditorDragWireSegmentTarget {
  type: "segment";

  /**
   * The segment id of the segment being targeted.
   */
  segmentId: string;

  /**
   * A fractional value indicating the distance between the segment's start and end where
   * the new segment wishes to attach.
   */
  segmentSplitLength: number;
}

export interface CircuitEditorDragWireJointTarget {
  type: "joint";

  /**
   * The joint id of the joint being targeted.
   */
  jointId: string;
}

/**
 * Defines a target for a wire drag that is free-floating in the field.
 * This is typically used for the end of a wire drag event, not for the beginning.
 */
export interface CircuitEditorDragWireFloatingTarget {
  type: "floating";

  /**
   * The point where this wire segment wishes to terminate.
   */
  point: Point;
}

export type CircuitEditorDragWireTarget =
  | CircuitEditorDragWirePinTarget
  | CircuitEditorDragWireSegmentTarget
  | CircuitEditorDragWireJointTarget
  | CircuitEditorDragWireFloatingTarget;
