import { AppState } from "@/store";

import { Point, pointEquals, pointSubtract } from "@/geometry";

import { selectedElementIdsSelector } from "@/services/selection/selectors/selection";

import { gridElementSnapSelector, gridJointSnapSelector } from "./snap";

let cachedDragMoveOffset: Point | null = null;
export const dragMoveOffsetSelector = (state: AppState) => {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "move") {
    return null;
  }

  const selectedElementIds = selectedElementIdsSelector(state);

  let gridSnap: number;
  if (selectedElementIds.length > 0) {
    gridSnap = gridElementSnapSelector(state);
  } else {
    gridSnap = gridJointSnapSelector(state);
  }

  const { dragStart, dragEnd, dragModifierKeys } = dragState;
  if (!dragEnd) {
    return null;
  }

  const offset = pointSubtract(dragEnd, dragStart);
  if (!dragModifierKeys.ctrlMetaKey) {
    offset.x = Math.round(offset.x / gridSnap) * gridSnap;
    offset.y = Math.round(offset.y / gridSnap) * gridSnap;
  }

  if (!cachedDragMoveOffset || !pointEquals(offset, cachedDragMoveOffset)) {
    cachedDragMoveOffset = offset;
  }

  return cachedDragMoveOffset;
};
