import { Position } from "@/types";

export const ACTION_DRAG_START_FIELD = "@editor/field/drag/start-field" as "@editor/field/drag/start-field";
export const startFieldDrag = (p: Position) => ({
  type: ACTION_DRAG_START_FIELD,
  payload: p
});
export type StartFieldDragAction = ReturnType<typeof startFieldDrag>;

export const ACTION_DRAG_START_NODE = "@editor/field/drag/start-node" as "@editor/field/drag/start-node";
export const startNodeDrag = (nodeId: string, p: Position) => ({
  type: ACTION_DRAG_START_NODE,
  payload: {
    ...p,
    nodeId
  }
});
export type StartNodeDragAction = ReturnType<typeof startNodeDrag>;

export const ACTION_DRAG_CONTINUE = "@editor/field/drag/continue" as "@editor/field/drag/continue";
export const continueDrag = (p: Position) => ({
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
  | StartFieldDragAction
  | StartNodeDragAction
  | ContinueDragAction
  | EndDragAction;
