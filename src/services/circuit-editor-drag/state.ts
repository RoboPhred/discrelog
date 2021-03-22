import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

import { ElementPin } from "../circuit-graph/types";

export interface CircuitEditorDragNullState {
  dragMode: null;
}

export interface CircuitEditorDragActiveState {
  /**
   * The editor this drag operation started in.
   */
  dragStartEditorId: string;

  /**
   * The start of the drag operation.
   */
  dragStart: Point;

  /**
   * The editor the drag operation is currently in.
   */
  dragEndEditorId: string | null;

  /**
   * The current end point for the drag operation.  This does not indicate the final
   * drag position, but the current most up to date position.
   */
  dragEnd: Point | null;
}

export interface CircuitEditorDragMoveState
  extends CircuitEditorDragActiveState {
  dragMode: "move";

  /**
   * The modifier keys in play for the drag operation.
   */
  dragModifierKeys: ModifierKeys;
}

export interface CircuitEditorDragSelectState
  extends CircuitEditorDragActiveState {
  dragMode: "select";

  /**
   * The modifier keys in play for the drag operation.
   */
  dragModifierKeys: ModifierKeys;
}

export interface CircuitEditorDragNewJointState
  extends CircuitEditorDragActiveState {
  dragMode: "new-joint";

  /**
   * The modifier keys in play for the drag operation.
   */
  dragModifierKeys: ModifierKeys;

  /**
   * The connection id to create the joint on.
   */
  dragNewJointConnectionId: string | null;

  /**
   * The joint id to add the new joint after.
   */
  dragNewJointAfterJointId: string | null;
}

export interface CircuitEditorDragConnectionState
  extends CircuitEditorDragActiveState {
  dragMode: "connection";

  /**
   * The source pin being connected by the drag.
   */
  dragPinSource: ElementPin | null;
}

export interface CircuitEditorDragWireSubjectPin {
  type: "pin";
  pin: ElementPin;
}
export interface CircuitEditorDragWireSubjectSegment {
  type: "segment";
  segmentId: string;
  segmentPositionFraction: number;
}

export type CircuitEditorDragWireSubject =
  | CircuitEditorDragWireSubjectPin
  | CircuitEditorDragWireSubjectSegment;
export interface CircuitEditorDragWireState
  extends CircuitEditorDragActiveState {
  dragMode: "wire";

  /**
   * The subject the wire is being dragged from.
   */
  dragSourceSubject: CircuitEditorDragWireSubject;
}

export type CircuitEditorDragServiceState =
  | CircuitEditorDragNullState
  | CircuitEditorDragMoveState
  | CircuitEditorDragSelectState
  | CircuitEditorDragNewJointState
  | CircuitEditorDragConnectionState;

const _defaultState: CircuitEditorDragServiceState = {
  dragMode: null,
};

export const defaultCircuitEditorDragServiceState = Object.freeze(
  _defaultState
);
