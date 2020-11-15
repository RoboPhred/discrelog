import { AnyAction } from "redux";

import { ElementType } from "@/element-defs";

export const ACTION_FIELD_DRAG_START_NEWNODE = "@field/drag/start/new-node" as const;
export const fieldDragStartNewNode = (nodeType: ElementType) => ({
  type: ACTION_FIELD_DRAG_START_NEWNODE,
  payload: {
    nodeType,
  },
});
export type FieldDragStartNewNodeAction = ReturnType<
  typeof fieldDragStartNewNode
>;
export function isFieldDragStartNewNodeAction(
  action: AnyAction
): action is FieldDragStartNewNodeAction {
  return action.type === ACTION_FIELD_DRAG_START_NEWNODE;
}
