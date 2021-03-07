import { DragObjectWithType } from "react-dnd";

export const NEW_NODE_DRAG_OBJECT = "@node/new" as const;
export const newNodeDragObject = (nodeType: string) => ({
  type: NEW_NODE_DRAG_OBJECT,
  payload: { nodeType },
});
export type NewNodeDragObject = ReturnType<typeof newNodeDragObject>;
export function isNewNodeDragObject(
  item: DragObjectWithType
): item is NewNodeDragObject {
  return item.type === NEW_NODE_DRAG_OBJECT;
}
