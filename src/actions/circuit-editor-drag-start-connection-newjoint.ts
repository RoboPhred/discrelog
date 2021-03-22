import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION_NEWJOINT = "@circuit-editor/drag/start/connection/new-joint" as const;
export const circuitEditorDragStartConnectionNewJoint = (
  connectionId: string,
  addAfterJointId: string | null,
  p: Point,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION_NEWJOINT,
  payload: {
    ...p,
    connectionId,
    addAfterJointId,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartConnectionNewJointAction = ReturnType<
  typeof circuitEditorDragStartConnectionNewJoint
>;
export function isCircuitEditorDragStartConnectionNewJointAction(
  action: AnyAction
): action is CircuitEditorDragStartConnectionNewJointAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION_NEWJOINT;
}
