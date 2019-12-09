import { Point } from "@/types";
import { AnyAction } from "redux";

export const ACTION_DRAG_CONTINUE = "@editor/field/drag/continue" as const;
export const dragContinue = (p: Point) => ({
  type: ACTION_DRAG_CONTINUE,
  payload: p
});
export type DragContinueAction = ReturnType<typeof dragContinue>;
export function isDragContinueAction(
  action: AnyAction
): action is DragContinueAction {
  return action.type === ACTION_DRAG_CONTINUE;
}
