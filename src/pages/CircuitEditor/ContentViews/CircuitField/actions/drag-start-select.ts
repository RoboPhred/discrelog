import { AnyAction } from "redux";

import { Point } from "@/types";

export const ACTION_DRAG_START_SELECT = "@editor/field/drag/start/select" as const;
export const dragStartSelect = (p: Point) => ({
  type: ACTION_DRAG_START_SELECT,
  payload: {
    ...p
  }
});
export type DragStartSelectAction = ReturnType<typeof dragStartSelect>;
export function isDragStartSelectAction(
  action: AnyAction
): action is DragStartSelectAction {
  return action.type === ACTION_DRAG_START_SELECT;
}
