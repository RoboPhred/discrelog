import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

import { NodePin } from "../node-graph/types";

export interface CircuitEditorUiDragServiceState {
  /**
   * The current drag operation being performed by the ui.
   */
  dragMode: "move" | "select" | "new-joint" | "wire" | null;

  /**
   * The circuit id in which the drag operation is occuring.
   * Used for select and wire modes.
   */
  dragCircuitId: string | null;

  /**
   * The modifier keys in play for the drag operation.
   */
  dragModifierKeys: ModifierKeys | null;

  /**
   * The start of the drag operation, if applicable for the current operation.
   */
  dragStart: Point | null;

  /**
   * The current end point for the drag operation.  This does not indicate the final
   * drag position, but the cumulative position.
   */
  dragEnd: Point | null;

  /**
   * if dragMode is "new-joint", the connection id to create the joint on.
   */
  dragNewJointConnectionId: string | null;

  /**
   * If dragMode is "new-joint", the joint id to add the new joint after.
   */
  dragNewJointAfterJointId: string | null;

  /**
   * If drag mode is "wire", this is the source pin being wired by the drag.
   */
  dragWireSource: NodePin | null;
}

const _defaultState: CircuitEditorUiDragServiceState = {
  dragMode: null,
  dragCircuitId: null,
  dragModifierKeys: null,
  dragStart: null,
  dragEnd: null,
  dragNewJointConnectionId: null,
  dragNewJointAfterJointId: null,
  dragWireSource: null,
};

export const defaultCircuitEditorUiDragServiceState = Object.freeze(
  _defaultState
);
