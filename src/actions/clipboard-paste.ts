import { AnyAction } from "redux";

export const ACTION_PASTE = "@clipboard/paste" as const;
export const paste = () => ({
  type: ACTION_PASTE
});
export type PasteAction = ReturnType<typeof paste>;
export function isPasteAction(action: AnyAction): action is PasteAction {
  return action.type === ACTION_PASTE;
}
