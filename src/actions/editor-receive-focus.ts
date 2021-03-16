import { AnyAction } from "redux";

export const ACTION_EDITOR_RECEIVE_FOCUS = "@editor/receive-focus" as const;
export const editorReceiveFocus = (editorId: string) => ({
  type: ACTION_EDITOR_RECEIVE_FOCUS,
  payload: { editorId },
});
export type EditorFocusAction = ReturnType<typeof editorReceiveFocus>;
export function isEditorReceiveFocusAction(
  action: AnyAction
): action is EditorFocusAction {
  return action.type === ACTION_EDITOR_RECEIVE_FOCUS;
}
