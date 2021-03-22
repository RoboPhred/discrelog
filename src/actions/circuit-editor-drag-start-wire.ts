import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ElementPin } from "@/services/circuit-graph/types";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_WIRE = "@circuit-editor/drag/start/wire" as const;
export const circuitEditorDragStartWire = (
  dragStart: Point,
  pin: ElementPin,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_WIRE,
  payload: {
    ...dragStart,
    pin,
    editorId,
  },
});
export type CircuitEditorDragStartWireAction = ReturnType<
  typeof circuitEditorDragStartWire
>;
export function isCircuitEditorDragStartWireAction(
  action: AnyAction
): action is CircuitEditorDragStartWireAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_WIRE;
}
