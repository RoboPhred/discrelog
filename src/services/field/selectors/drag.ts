import { createSelector } from "reselect";

import { AppState } from "@/store";
import { pointSubtract, normalizeRectangle } from "@/geometry";

import { FieldState } from "../state";
import { createFieldSelector } from "../utils";

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

export const dragEndSelector = createFieldSelector(s => s.dragEnd);

export const isDraggingNewNodeSelector = createFieldSelector(
  s => s.dragMode === "new-node"
);

export const dragNewNodeTypeSelector = createFieldSelector(s =>
  s.dragMode === "new-node" ? s.dragNewNodeType : null
);
