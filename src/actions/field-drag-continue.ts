import { AnyAction } from "redux";
import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_FIELD_DRAG_CONTINUE = "@field/drag/continue" as const;
export const fieldDragContinue = (p: Point, modifierKeys: ModifierKeys) => ({
  type: ACTION_FIELD_DRAG_CONTINUE,
  payload: { dragPos: p, modifierKeys },
});
export type FieldDragContinueAction = ReturnType<typeof fieldDragContinue>;
export function isFieldDragContinueAction(
  action: AnyAction
): action is FieldDragContinueAction {
  return action.type === ACTION_FIELD_DRAG_CONTINUE;
}
