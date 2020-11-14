import { AnyAction } from "redux";

export const ACTION_SELECTION_MOVE = "@selection/move" as const;
export const moveSelection = (offsetX: number, offsetY: number) => ({
  type: ACTION_SELECTION_MOVE,
  payload: { offsetX, offsetY },
});
export type MoveSelectionAction = ReturnType<typeof moveSelection>;
export function isMoveSelectionAction(
  action: AnyAction
): action is MoveSelectionAction {
  return action.type === ACTION_SELECTION_MOVE;
}
