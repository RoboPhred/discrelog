import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_END = "@circuit-editor/drag/end" as const;
export const circuitEditorDragEnd = (
  point: Point,
  modifierKeys: ModifierKeys
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_END,
  payload: { ...point, modifierKeys },
});
export type CircuitEditorDragEndAction = ReturnType<
  typeof circuitEditorDragEnd
>;
export function isCircuitEditorDragEndAction(
  action: AnyAction
): action is CircuitEditorDragEndAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_END;
}
