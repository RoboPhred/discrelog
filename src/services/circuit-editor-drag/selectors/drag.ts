import { createSelector } from "reselect";

import { AppState } from "@/store";

import {
  normalizeRectangle,
  Point,
  pointEquals,
  pointSubtract,
} from "@/geometry";

import { selectedElementIdsSelector } from "@/services/selection/selectors/selection";
import { elementPinFromPointSelector } from "@/services/element-layout/selectors/element-pin-positions";
import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import { createCircuitEditorDragSelector } from "../utils";
import { CircuitEditorDragServiceState } from "../state";

import { gridJointSnapSelector, gridElementSnapSelector } from "./snap";

export const dragModeSelector = createCircuitEditorDragSelector(
  (s) => s.dragMode
);

export const isEditorDraggingSelector = createCircuitEditorDragSelector(
  (s: CircuitEditorDragServiceState, editorId: string) => {
    if (s.dragMode == null) {
      return false;
    }

    // TODO: Allow dragging in dragEndEditorId if dragMode is move.
    if (s.dragStartEditorId !== s.dragEndEditorId) {
      return false;
    }

    return s.dragStartEditorId === editorId;
  }
);

export const isDraggingSelector = createCircuitEditorDragSelector(
  (s) => s.dragMode != null
);

export const dragStartSelector = createCircuitEditorDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragStart;
});

export const dragEndSelector = createCircuitEditorDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragEnd;
});

export const selectionRectSelector = createCircuitEditorDragSelector(
  createSelector(
    dragModeSelector.local,
    dragStartSelector.local,
    dragEndSelector.local,
    (dragMode, dragStart, dragEnd) =>
      dragMode === "select" && dragStart && dragEnd
        ? normalizeRectangle(dragStart, dragEnd)
        : null
  )
);

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

export const dragNewJointPositionSelector = createCircuitEditorDragSelector(
  (state) => {
    const gridSnap = gridJointSnapSelector.local(state);
    if (state.dragMode !== "new-joint") {
      return null;
    }

    const { dragEnd, dragModifierKeys } = state;
    if (!dragEnd || !dragModifierKeys) {
      return null;
    }

    const position = { ...dragEnd };
    if (!dragModifierKeys.ctrlMetaKey) {
      position.x = Math.round(position.x / gridSnap) * gridSnap;
      position.y = Math.round(position.y / gridSnap) * gridSnap;
    }

    return position;
  }
);

export const dragDropTargetPinSelector = (state: AppState) => {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "wire") {
    return null;
  }

  const { dragEnd, dragStartEditorId } = dragState;
  if (!dragEnd) {
    return null;
  }

  const circuitId = circuitIdForEditorIdSelector(state, dragStartEditorId);
  if (!circuitId) {
    return null;
  }

  return elementPinFromPointSelector(state, dragEnd, circuitId);
};
