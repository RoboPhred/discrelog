import { AnyAction } from "redux";

export const ACTION_CIRCUIT_EDITOR_RECEIVE_FOCUS = "@circuit-editor/receive-focus" as const;
export const circuitEditorReceiveFocus = (editorId: string) => ({
  type: ACTION_CIRCUIT_EDITOR_RECEIVE_FOCUS,
  payload: { editorId },
});
export type CircuitEditorFocusAction = ReturnType<
  typeof circuitEditorReceiveFocus
>;
export function isCircuitEditorReceiveFocusAction(
  action: AnyAction
): action is CircuitEditorFocusAction {
  return action.type === ACTION_CIRCUIT_EDITOR_RECEIVE_FOCUS;
}
