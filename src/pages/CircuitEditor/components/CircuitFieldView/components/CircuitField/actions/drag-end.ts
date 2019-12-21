import { AnyAction } from "redux";

import { Point } from "@/types";

import { SelectionMode } from "@/pages/CircuitEditor/types";

export const ACTION_DRAG_END = "@editor/field/drag/end" as const;
export const dragEnd = (point: Point, selectionMode: SelectionMode) => ({
  type: ACTION_DRAG_END,
  payload: { ...point, selectionMode }
});
export type DragEndAction = ReturnType<typeof dragEnd>;
export function isDragEndAction(action: AnyAction): action is DragEndAction {
  return action.type === ACTION_DRAG_END;
}
