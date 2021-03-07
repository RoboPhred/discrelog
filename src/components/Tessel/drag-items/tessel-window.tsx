import { DragObjectWithType } from "react-dnd";

export const TESSEL_WINDOW_DRAG_OBJECT = "@tessel/window" as const;
export const tesselWindowDragObject = (path: string[]) => ({
  type: TESSEL_WINDOW_DRAG_OBJECT,
  payload: { path },
});
export type TesselWindowDragObject = ReturnType<typeof tesselWindowDragObject>;
export function isTesselWindowDragObject(
  item: DragObjectWithType
): item is TesselWindowDragObject {
  return item.type === TESSEL_WINDOW_DRAG_OBJECT;
}
