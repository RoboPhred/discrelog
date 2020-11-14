import { AnyAction } from "redux";

import { Point } from "@/types";
import { SelectionMode } from "@/selection-mode";

export const ACTION_FIELD_DRAG_START_NODE = "@field/drag/start/node" as const;
export const fieldDragStartNode = (
  nodeId: string,
  p: Point,
  selectionMode: SelectionMode
) => ({
  type: ACTION_FIELD_DRAG_START_NODE,
  payload: {
    ...p,
    nodeId,
    selectionMode,
  },
});
export type FieldDragStartNodeAction = ReturnType<typeof fieldDragStartNode>;
export function isFieldDragStartNodeAction(
  action: AnyAction
): action is FieldDragStartNodeAction {
  return action.type === ACTION_FIELD_DRAG_START_NODE;
}
