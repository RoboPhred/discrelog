import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";
import { Point } from "@/geometry";

export interface ElementMoveOpts {
  relative?: boolean;
  snapMode?: "none" | "element";
}
export const ACTION_ELEMENT_MOVE = "@element/move" as const;
export const moveElement = (
  elementId: MaybeArray<string>,
  position: Point,
  opts: ElementMoveOpts = {}
) => ({
  type: ACTION_ELEMENT_MOVE,
  payload: {
    elementIds: asArray(elementId),
    position,
    relative: opts.relative ?? false,
    snapMode: opts.snapMode ?? "none",
  },
});
export type MoveElementAction = ReturnType<typeof moveElement>;
export function isMoveElementAction(
  action: AnyAction
): action is MoveElementAction {
  return action.type === ACTION_ELEMENT_MOVE;
}
