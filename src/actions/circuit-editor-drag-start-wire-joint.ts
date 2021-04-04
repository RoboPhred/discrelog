import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_WIRE_JOINT = "@circuit-editor/drag/start/wire-joint" as const;
export const circuitEditorDragStartWireJoint = (
  p: Point,
  wireId: string,
  jointId: string,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_WIRE_JOINT,
  payload: {
    ...p,
    wireId,
    jointId,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartWireJointAction = ReturnType<
  typeof circuitEditorDragStartWireJoint
>;
export function isCircuitEditorDragStartWireJointAction(
  action: AnyAction
): action is CircuitEditorDragStartWireJointAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_WIRE_JOINT;
}
