import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ElementPin } from "@/services/circuit-graph/types";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION = "@circuit-editor/drag/start/connection" as const;
export const circuitEditorDragStartConnection = (
  dragStart: Point,
  pin: ElementPin,
  editorId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION,
  payload: {
    ...dragStart,
    pin,
    editorId,
  },
});
export type CircuitEditorDragStartConnectionAction = ReturnType<
  typeof circuitEditorDragStartConnection
>;
export function isCircuitEditorDragStartConnectionAction(
  action: AnyAction
): action is CircuitEditorDragStartConnectionAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_CONNECTION;
}
