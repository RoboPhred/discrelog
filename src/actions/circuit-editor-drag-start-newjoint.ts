import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_NEWJOINT = "@circuit-editor/drag/start/new-joint" as const;
export const circuitEditorDragStartNewJoint = (
  connectionId: string,
  addAfterJointId: string | null,
  p: Point,
  modifierKeys: ModifierKeys
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_NEWJOINT,
  payload: {
    ...p,
    connectionId,
    addAfterJointId,
    modifierKeys,
  },
});
export type CircuitEditorDragStartNewJointAction = ReturnType<
  typeof circuitEditorDragStartNewJoint
>;
export function isCircuitEditorDragStartNewJointAction(
  action: AnyAction
): action is CircuitEditorDragStartNewJointAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_NEWJOINT;
}
