import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_START_SELECT = "@circuit-editor/drag/start/select" as const;
export const circuitEditorDragStartSelect = (
  p: Point,
  modifierKeys: ModifierKeys,
  circuitId: string
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_START_SELECT,
  payload: {
    ...p,
    modifierKeys,
    circuitId,
  },
});
export type CircuitEditorDragStartSelectAction = ReturnType<
  typeof circuitEditorDragStartSelect
>;
export function isCircuitEditorDragStartSelectAction(
  action: AnyAction
): action is CircuitEditorDragStartSelectAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_START_SELECT;
}
