import { AppState } from "@/store";

import {
  normalize,
  Point,
  pointEquals,
  pointSubtract,
  snapPoint,
} from "@/geometry";

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

  let offset = pointSubtract(dragEnd, dragStart);

  if (dragModifierKeys.shiftKey) {
    const lineVector = normalize(pointSubtract(dragEnd, dragStart));
    if (Math.abs(lineVector.x) >= 0.5) {
      offset = {
        x: offset.x,
        y: 0,
      };
    } else {
      offset = {
        x: 0,
        y: offset.y,
      };
    }
  }

  if (!dragModifierKeys.ctrlMetaKey) {
    offset = snapPoint(offset, gridSnap);
  }

  if (!cachedDragMoveOffset || !pointEquals(offset, cachedDragMoveOffset)) {
    cachedDragMoveOffset = offset;
  }

  return cachedDragMoveOffset;
};
