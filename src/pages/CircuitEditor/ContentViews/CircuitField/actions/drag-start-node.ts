import { AnyAction } from "redux";

import { Point } from "@/types";

import { SelectionMode } from "@/pages/CircuitEditor/types";

export const ACTION_DRAG_START_NODE = "@editor/field/drag/start/node" as const;
export const dragStartNode = (
  nodeId: string,
  p: Point,
  selectionMode: SelectionMode
) => ({
  type: ACTION_DRAG_START_NODE,
  payload: {
    ...p,
    nodeId,
    selectionMode
  }
});
export type DragStartNodeAction = ReturnType<typeof dragStartNode>;
export function isDragStartNodeAction(
  action: AnyAction
): action is DragStartNodeAction {
  return action.type === ACTION_DRAG_START_NODE;
}
