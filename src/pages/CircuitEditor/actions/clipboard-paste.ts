import { AnyAction } from "redux";

export const ACTION_PASTE = "@editor/paste" as const;
export const paste = () => ({
  type: ACTION_PASTE
});
export type PasteAction = ReturnType<typeof paste>;
export function isPasteAction(action: AnyAction): action is PasteAction {
  return action.type === ACTION_PASTE;
}
