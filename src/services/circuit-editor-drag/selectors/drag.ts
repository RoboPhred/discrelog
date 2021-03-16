import { createSelector } from "reselect";

import { AppState } from "@/store";

import {
  normalizeRectangle,
  Point,
  pointEquals,
  pointSubtract,
} from "@/geometry";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

import { createCircuitEditorUiDragSelector } from "../utils";
import { CircuitEditorDragServiceState } from "../state";

import { gridJointSnapSelector, gridNodeSnapSelector } from "./snap";
import { nodePinFromPointSelector } from "@/services/node-layout/selectors/node-pin-positions";

// FIXME: Hack to stop drag appearing on the wrong windows.
// Drag state should be local to CircuitEditor, not global in redux.
export const isDragForCircuitSelector = createCircuitEditorUiDragSelector(
  (s: CircuitEditorDragServiceState, circuitId: string) => {
    if (!s.dragMode) {
      return false;
    }

    return s.dragCircuitId === circuitId;
  }
);

export const dragModeSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragMode
);
export const isDraggingSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragMode != null
);
export const dragCircuitIdSelector = createCircuitEditorUiDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragCircuitId;
});
export const dragStartSelector = createCircuitEditorUiDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragStart;
});
export const dragEndSelector = createCircuitEditorUiDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragEnd;
});

export const selectionRectSelector = createCircuitEditorUiDragSelector(
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

  const selectedNodeIds = selectedNodeIdsSelector(state);

  let gridSnap: number;
  if (selectedNodeIds.length > 0) {
    gridSnap = gridNodeSnapSelector(state);
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

export const dragNewJointPositionSelector = createCircuitEditorUiDragSelector(
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

  const { dragEnd, dragCircuitId } = dragState;
  if (!dragEnd) {
    return null;
  }

  return nodePinFromPointSelector(state, dragEnd, dragCircuitId);
};
