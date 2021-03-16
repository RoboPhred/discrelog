import { AnyAction } from "redux";

export const ACTION_CIRCUIT_EDITOR_MOUSE_LEAVE = "@circuit-editor/mouse/leave" as const;
export const circuitEditorMouseLeave = () => ({
  type: ACTION_CIRCUIT_EDITOR_MOUSE_LEAVE,
});
export type CircuitEditorMouseLeaveAction = ReturnType<
  typeof circuitEditorMouseLeave
>;
export function isCircuitEditorMouseLeaveAction(
  action: AnyAction
): action is CircuitEditorMouseLeaveAction {
  return action.type === ACTION_CIRCUIT_EDITOR_MOUSE_LEAVE;
}
