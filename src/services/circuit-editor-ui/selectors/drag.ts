import { createSelector } from "reselect";

import { normalizeRectangle } from "@/geometry";

import { CircuitEditorUiState } from "../state";
import { createCircuitEditorUiSelector } from "../utils";

import { gridSnapSelector } from "./snap";

export const selectionRectSelector = createCircuitEditorUiSelector(
  createSelector(
    (s: CircuitEditorUiState) => s.dragMode,
    (s: CircuitEditorUiState) => s.dragStart,
    (s: CircuitEditorUiState) => s.dragEnd,
    (dragMode, dragStart, dragEnd) =>
      dragMode === "select" && dragStart && dragEnd
        ? normalizeRectangle(dragStart, dragEnd)
        : null
  )
);

export const dragMoveOffsetSelector = createCircuitEditorUiSelector(
  createSelector(
    (s: CircuitEditorUiState) => s.dragMode,
    (s: CircuitEditorUiState) => s.dragStart,
    (s: CircuitEditorUiState) => s.dragEnd,
    gridSnapSelector.local,
    (dragMode, dragStart, dragEnd, gridSnap) =>
      dragMode === "move" && dragStart && dragEnd
        ? {
            x: Math.round((dragEnd.x - dragStart.x) / gridSnap) * gridSnap,
            y: Math.round((dragEnd.y - dragStart.y) / gridSnap) * gridSnap,
          }
        : null
  )
);

export const dragEndSelector = createCircuitEditorUiSelector((s) => s.dragEnd);

export const isDraggingNewNodeSelector = createCircuitEditorUiSelector(
  (s) => s.dragMode === "new-element"
);

export const dragNewNodeTypeSelector = createCircuitEditorUiSelector((s) =>
  s.dragMode === "new-element" ? s.dragNewElementType : null
);
