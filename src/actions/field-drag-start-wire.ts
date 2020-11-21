import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { NodePin } from "@/services/circuit-graph/types";

export const ACTION_FIELD_DRAG_START_WIRE = "@field/drag/start/wire" as const;
export const fieldDragStartWire = (dragStart: Point, pin: NodePin) => ({
  type: ACTION_FIELD_DRAG_START_WIRE,
  payload: {
    dragStart,
    pin,
  },
});
export type FieldDragStartWireAction = ReturnType<typeof fieldDragStartWire>;
export function isFieldDragStartWireAction(
  action: AnyAction
): action is FieldDragStartWireAction {
  return action.type === ACTION_FIELD_DRAG_START_WIRE;
}
