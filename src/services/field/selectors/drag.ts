import { createSelector } from "reselect";

import { AppState } from "@/store";
import { pointSubtract, normalizeRectangle } from "@/geometry";

import { FieldState } from "../state";

export const selectionRectSelector = createSelector(
  (s: AppState) => s.services.field,
  (s: FieldState) =>
    s.dragMode === "select" && s.dragStart && s.dragEnd
      ? normalizeRectangle(s.dragStart, s.dragEnd)
      : null
);

export const dragMoveOffsetSelector = createSelector(
  (s: AppState) => s.services.field,
  (s: FieldState) =>
    s.dragMode === "move" && s.dragStart && s.dragEnd
      ? pointSubtract(s.dragEnd, s.dragStart)
      : null
);
