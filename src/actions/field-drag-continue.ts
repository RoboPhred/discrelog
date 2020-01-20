import { AnyAction } from "redux";
import { Point } from "@/types";

export const ACTION_FIELD_DRAG_CONTINUE = "@field/drag/continue" as const;
export const fieldDragContinue = (p: Point) => ({
  type: ACTION_FIELD_DRAG_CONTINUE,
  payload: p
});
export type FieldDragContinueAction = ReturnType<typeof fieldDragContinue>;
export function isFieldDragContinueAction(
  action: AnyAction
): action is FieldDragContinueAction {
  return action.type === ACTION_FIELD_DRAG_CONTINUE;
}
