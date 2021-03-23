import { createSelector } from "reselect";

import { normalizeRectangle } from "@/geometry";

import { createCircuitEditorDragSelector } from "../utils";

import { dragEndSelector, dragModeSelector, dragStartSelector } from "./drag";

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
