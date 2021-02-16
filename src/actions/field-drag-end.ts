import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_FIELD_DRAG_END = "@field/drag/end" as const;
export const fieldDragEnd = (point: Point, modifierKeys: ModifierKeys) => ({
  type: ACTION_FIELD_DRAG_END,
  payload: { ...point, modifierKeys },
});
export type FieldDragEndAction = ReturnType<typeof fieldDragEnd>;
export function isFieldDragEndAction(
  action: AnyAction
): action is FieldDragEndAction {
  return action.type === ACTION_FIELD_DRAG_END;
}
