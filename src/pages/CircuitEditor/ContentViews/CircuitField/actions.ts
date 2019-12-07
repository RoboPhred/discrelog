import { Point } from "@/types";

import { DragModeType } from "./types";
import { NodePinDirection } from "@/services/simulator";

export const ACTION_SELECT_PIN = "@editor/field/select-pin" as "@editor/field/select-pin";
export const selectPin = (nodeId: string, pinId: string) => ({
  type: ACTION_SELECT_PIN,
  payload: {
    nodeId,
    pinId
  }
});
export type SelectPinAction = ReturnType<typeof selectPin>;

export const ACTION_DRAG_START = "@editor/field/drag/start" as "@editor/field/drag/start";
export const startDrag = (p: Point, dragMode: DragModeType) => ({
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
  | SelectPinAction
  | StartDragAction
  | ContinueDragAction
  | EndDragAction;
