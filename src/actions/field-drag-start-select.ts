import { AnyAction } from "redux";

import { Point } from "@/geometry";

export const ACTION_FIELD_DRAG_START_SELECT = "@field/drag/start/select" as const;
export const fieldDragStartSelect = (p: Point, circuitId: string) => ({
  type: ACTION_FIELD_DRAG_START_SELECT,
  payload: {
    ...p,
    circuitId,
  },
});
export type FieldDragStartSelectAction = ReturnType<
  typeof fieldDragStartSelect
>;
export function isFieldDragStartSelectAction(
  action: AnyAction
): action is FieldDragStartSelectAction {
  return action.type === ACTION_FIELD_DRAG_START_SELECT;
}
