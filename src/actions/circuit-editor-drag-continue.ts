import { AnyAction } from "redux";
import { Point } from "@/geometry";
import { ModifierKeys } from "@/modifier-keys";

export const ACTION_CIRCUIT_EDITOR_DRAG_CONTINUE = "@circuit-editor/drag/continue" as const;
export const circuitEditorDragContinue = (
  p: Point,
  modifierKeys: ModifierKeys
) => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_CONTINUE,
  payload: { dragPos: p, modifierKeys },
});
export type CircuitEditorDragContinueAction = ReturnType<
  typeof circuitEditorDragContinue
>;
export function isCircuitEditorDragContinueAction(
  action: AnyAction
): action is CircuitEditorDragContinueAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_CONTINUE;
}
