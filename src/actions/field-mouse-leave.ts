import { AnyAction } from "redux";

export const ACTION_FIELD_MOUSE_LEAVE = "@field/mouse/leave" as const;
export const fieldMouseLeave = () => ({
  type: ACTION_FIELD_MOUSE_LEAVE
});
export type FieldMouseLeaveAction = ReturnType<typeof fieldMouseLeave>;
export function isFieldMouseLeaveAction(
  action: AnyAction
): action is FieldMouseLeaveAction {
  return action.type === ACTION_FIELD_MOUSE_LEAVE;
}
