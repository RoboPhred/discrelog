import { DragObjectWithType } from "react-dnd";

export const NEW_ELEMENT_DRAG_OBJECT = "@element/new" as const;
export const newElementDragObject = (elementType: string) => ({
  type: NEW_ELEMENT_DRAG_OBJECT,
  payload: { elementType },
});
export type NewElementDragObject = ReturnType<typeof newElementDragObject>;
export function isNewElementDragObject(
  item: DragObjectWithType
): item is NewElementDragObject {
  return item.type === NEW_ELEMENT_DRAG_OBJECT;
}
