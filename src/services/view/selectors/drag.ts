import { createSelector } from "reselect";

import { pointSubtract, normalizeRectangle } from "@/geometry";

import { ViewState } from "../state";
import { createViewSelector } from "../utils";

export const selectionRectSelector = createViewSelector(
  createSelector(
    (s: ViewState) => s.dragMode,
    (s: ViewState) => s.dragStart,
    (s: ViewState) => s.dragEnd,
    (dragMode, dragStart, dragEnd) =>
      dragMode === "select" && dragStart && dragEnd
        ? normalizeRectangle(dragStart, dragEnd)
        : null
  )
);

export const dragMoveOffsetSelector = createViewSelector(
  createSelector(
    (s: ViewState) => s.dragMode,
    (s: ViewState) => s.dragStart,
    (s: ViewState) => s.dragEnd,
    (dragMode, dragStart, dragEnd) =>
      dragMode === "move" && dragStart && dragEnd
        ? pointSubtract(dragEnd, dragStart)
        : null
  )
);

export const dragEndSelector = createViewSelector((s) => s.dragEnd);

export const isDraggingNewNodeSelector = createViewSelector(
  (s) => s.dragMode === "new-element"
);

export const dragNewNodeTypeSelector = createViewSelector((s) =>
  s.dragMode === "new-element" ? s.dragNewElementType : null
);
