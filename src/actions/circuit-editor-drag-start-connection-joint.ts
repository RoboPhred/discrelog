import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION_JOINT = "@circuit-editor/drag/start/connection/joint" as const;
export const circuitEditorDragStartConnectionJoint = (
  jointId: string,
  p: Point,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION_JOINT,
  payload: {
    ...p,
    jointId,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartConnectionJointAction = ReturnType<
  typeof circuitEditorDragStartConnectionJoint
>;
export function isCircuitEditorDragStartConnectionJointAction(
  action: AnyAction
): action is CircuitEditorDragStartConnectionJointAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION_JOINT;
}
