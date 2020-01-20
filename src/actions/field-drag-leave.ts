import { AnyAction } from "redux";

export const ACTION_FIELD_DRAG_LEAVE = "@field/drag/leave" as const;
export const fieldDragLeave = () => ({
  type: ACTION_FIELD_DRAG_LEAVE
});
export type FieldDragLeaveAction = ReturnType<typeof fieldDragLeave>;
export function isFieldDragLeaveAction(
  action: AnyAction
): action is FieldDragLeaveAction {
  return action.type === ACTION_FIELD_DRAG_LEAVE;
}
