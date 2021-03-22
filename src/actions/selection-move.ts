import { AnyAction } from "redux";

export interface MoveSelectionOpts {
  snapMode?: "none" | "element" | "by-type";
}
export const ACTION_SELECTION_MOVE = "@selection/move" as const;
export const moveSelection = (
  offsetX: number,
  offsetY: number,
  opts: MoveSelectionOpts = {}
) => ({
  type: ACTION_SELECTION_MOVE,
  payload: { offsetX, offsetY, snapMode: opts.snapMode ?? "none" },
});
export type MoveSelectionAction = ReturnType<typeof moveSelection>;
export function isMoveSelectionAction(
  action: AnyAction
): action is MoveSelectionAction {
  return action.type === ACTION_SELECTION_MOVE;
}
