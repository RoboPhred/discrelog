import { AnyAction } from "redux";

export const ACTION_CIRCUIT_EDITOR_DRAG_ABORT = "@circuit-editor/drag/abort" as const;
export const circuitEditorDragAbort = () => ({
  type: ACTION_CIRCUIT_EDITOR_DRAG_ABORT,
});
export type CircuitEditorDragAbortAction = ReturnType<
  typeof circuitEditorDragAbort
>;
export function isCircuitEditorDragAbortAction(
  action: AnyAction
): action is CircuitEditorDragAbortAction {
  return action.type === ACTION_CIRCUIT_EDITOR_DRAG_ABORT;
}
