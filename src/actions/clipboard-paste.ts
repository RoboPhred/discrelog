import { Point } from "@/geometry";
import { AnyAction } from "redux";

export interface PasteOpts {
  pastePosition?: Point;
}
export const ACTION_PASTE = "@clipboard/paste" as const;
export const paste = (opts: PasteOpts = {}) => ({
  type: ACTION_PASTE,
  payload: { ...opts },
});
export type PasteAction = ReturnType<typeof paste>;
export function isPasteAction(action: AnyAction): action is PasteAction {
  return action.type === ACTION_PASTE;
}
