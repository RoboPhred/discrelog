import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_JOINT = "@circuit-editor/drag/start/joint" as const;
export const circuitEditorDragStartJoint = (
  jointId: string,
  p: Point,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_JOINT,
  payload: {
    ...p,
    jointId,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartJointAction = ReturnType<
  typeof circuitEditorDragStartJoint
>;
export function isCircuitEditorDragStartJointAction(
  action: AnyAction
): action is CircuitEditorDragStartJointAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_JOINT;
}
