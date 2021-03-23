import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";
import { CircuitEditorDragWireTarget } from "@/services/circuit-editor-drag/types";

export const CIRCUIT_EDITOR_DRAG_START_WIRE_ACTION = "@circuit-editor/drag/start/wire" as const;
export const circuitEditorDragStartWire = (
  p: Point,
  target: CircuitEditorDragWireTarget,
  modifierKeys: ModifierKeys,
  editorId: string
) => ({
  type: CIRCUIT_EDITOR_DRAG_START_WIRE_ACTION,
  payload: {
    ...p,
    target,
    modifierKeys,
    editorId,
  },
});
export type CircuitEditorDragStartWireAction = ReturnType<
  typeof circuitEditorDragStartWire
>;
export function isCircuitEditorDragStartWireAction(
  action: AnyAction
): action is CircuitEditorDragStartWireAction {
  return action.type === CIRCUIT_EDITOR_DRAG_START_WIRE_ACTION;
}
