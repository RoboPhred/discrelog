import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_FIELD_DRAG_START_SELECT = "@field/drag/start/select" as const;
export const fieldDragStartSelect = (
  p: Point,
  modifierKeys: ModifierKeys,
  circuitId: string
) => ({
  type: ACTION_FIELD_DRAG_START_SELECT,
  payload: {
    ...p,
    modifierKeys,
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
