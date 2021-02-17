import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_FIELD_DRAG_START_NEWJOINT = "@field/drag/start/new-joint" as const;
export const fieldDragStartNewJoint = (
  connectionId: string,
  addAfterJointId: string | null,
  p: Point,
  modifierKeys: ModifierKeys
) => ({
  type: ACTION_FIELD_DRAG_START_NEWJOINT,
  payload: {
    ...p,
    connectionId,
    addAfterJointId,
    modifierKeys,
  },
});
export type FieldDragStartNewJointAction = ReturnType<
  typeof fieldDragStartNewJoint
>;
export function isFieldDragStartNewJointAction(
  action: AnyAction
): action is FieldDragStartNewJointAction {
  return action.type === ACTION_FIELD_DRAG_START_NEWJOINT;
}
