import { Point } from "@/types";

export const ACTION_DRAG_START = "@editor/field/drag/start" as "@editor/field/drag/start";
export const startDrag = (p: Point, dragMode: "select" | "move") => ({
  type: ACTION_DRAG_START,
  payload: {
    ...p,
    dragMode
  }
});
export type StartDragAction = ReturnType<typeof startDrag>;

export const ACTION_DRAG_CONTINUE = "@editor/field/drag/continue" as "@editor/field/drag/continue";
export const continueDrag = (p: Point) => ({
  type: ACTION_DRAG_CONTINUE,
  payload: p
});
export type ContinueDragAction = ReturnType<typeof continueDrag>;

export const ACTION_DRAG_END = "@editor/field/drag/end" as "@editor/field/drag/end";
export const endDrag = () => ({
  type: ACTION_DRAG_END
});
export type EndDragAction = ReturnType<typeof endDrag>;

export type CircuitFieldAction =
  | StartDragAction
  | ContinueDragAction
  | EndDragAction;
