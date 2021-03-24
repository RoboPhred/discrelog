import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const CIRCUIT_EDITOR_DRAG_START_WIRE_JOINT_ACTION = "@circuit-editor/drag/start/wire-joint" as const;
export const circuitEditorDragStartWireJoint = (
  p: Point,
  jointId: string,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: CIRCUIT_EDITOR_DRAG_START_WIRE_JOINT_ACTION,
  payload: {
    ...p,
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
  return action.type === CIRCUIT_EDITOR_DRAG_START_WIRE_JOINT_ACTION;
}
