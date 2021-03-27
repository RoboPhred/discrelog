import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";
import { WireConnectTarget } from "../circuit-graph/types";

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

  /**
   * The modifier keys in play for the drag operation.
   */
  dragModifierKeys: ModifierKeys;
}

export interface CircuitEditorDragMoveState
  extends CircuitEditorDragActiveState {
  dragMode: "move";
}

export interface CircuitEditorDragSelectState
  extends CircuitEditorDragActiveState {
  dragMode: "select";
}

export interface CircuitEditorDragWireState
  extends CircuitEditorDragActiveState {
  dragMode: "wire";

  /**
   * The wire connection target this drag is starting from.
   */
  dragStartTarget: WireConnectTarget;
}

export interface CircuitEditorDragWireSegmentNewJointState
  extends CircuitEditorDragActiveState {
  dragMode: "wire-segment-new-joint";

  /**
   * The id of the wire whose segment is being dragged.
   */
  dragWireId: string;

  /**
   * The id of the wire segment being dragged.
   */
  dragWireSegmentId: string;
}

export type CircuitEditorDragServiceState =
  | CircuitEditorDragNullState
  | CircuitEditorDragMoveState
  | CircuitEditorDragSelectState
  | CircuitEditorDragWireState
  | CircuitEditorDragWireSegmentNewJointState;

const _defaultState: CircuitEditorDragServiceState = {
  dragMode: null,
};

export const defaultCircuitEditorDragServiceState = Object.freeze(
  _defaultState
);
