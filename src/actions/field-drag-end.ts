import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { SelectionMode } from "@/selection-mode";

export const ACTION_FIELD_DRAG_END = "@field/drag/end" as const;
export const fieldDragEnd = (point: Point, selectionMode: SelectionMode) => ({
  type: ACTION_FIELD_DRAG_END,
  payload: { ...point, selectionMode },
});
export type FieldDragEndAction = ReturnType<typeof fieldDragEnd>;
export function isFieldDragEndAction(
  action: AnyAction
): action is FieldDragEndAction {
  return action.type === ACTION_FIELD_DRAG_END;
}
