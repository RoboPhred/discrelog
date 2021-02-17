import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_FIELD_DRAG_START_JOINT = "@field/drag/start/joint" as const;
export const fieldDragStartJoint = (
  jointId: string,
  p: Point,
  modifierKeys: ModifierKeys
) => ({
  type: ACTION_FIELD_DRAG_START_JOINT,
  payload: {
    ...p,
    jointId,
    modifierKeys,
  },
});
export type FieldDragStartJointAction = ReturnType<typeof fieldDragStartJoint>;
export function isFieldDragStartJointAction(
  action: AnyAction
): action is FieldDragStartJointAction {
  return action.type === ACTION_FIELD_DRAG_START_JOINT;
}
