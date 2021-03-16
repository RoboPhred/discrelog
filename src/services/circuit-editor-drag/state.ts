import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

import { NodePin } from "../node-graph/types";

export interface CircuitEditorDragNullState {
  dragMode: null;
}

export interface CircuitEditorDragActiveState {
  /**
   * The circuit this drag operation is taking place in.
   */
  dragCircuitId: string;

  /**
   * The start of the drag operation.
   */
  dragStart: Point;

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

export interface CircuitEditorDragWireState
  extends CircuitEditorDragActiveState {
  dragMode: "wire";

  /**
   * If drag mode is "wire", this is the source pin being wired by the drag.
   */
  dragWireSource: NodePin | null;
}

export type CircuitEditorDragServiceState =
  | CircuitEditorDragNullState
  | CircuitEditorDragMoveState
  | CircuitEditorDragSelectState
  | CircuitEditorDragNewJointState
  | CircuitEditorDragWireState;

const _defaultState: CircuitEditorDragServiceState = {
  dragMode: null,
};

export const defaultCircuitEditorDragServiceState = Object.freeze(
  _defaultState
);
