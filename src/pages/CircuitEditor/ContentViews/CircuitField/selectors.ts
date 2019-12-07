import { createSelector } from "reselect";

import { AppState } from "@/store";
import { normalizeRectangle, pointSubtract } from "@/geometry";

import { CircuitFieldState } from "./state";

export const circuitFieldState = (state: AppState) =>
  state.ui.circuitEditor.circuitField;

export const selectionRectSelector = createSelector(
  circuitFieldState,
  (s: CircuitFieldState) =>
    s.dragMode === "select" && s.dragStart && s.dragEnd
      ? normalizeRectangle(s.dragStart, s.dragEnd)
      : null
);

export const dragMoveOffsetSelector = createSelector(
  circuitFieldState,
  (s: CircuitFieldState) =>
    s.dragMode === "move-node" && s.dragStart && s.dragEnd
      ? pointSubtract(s.dragEnd, s.dragStart)
      : null
);

export const selectedPinSelector = createSelector(
  circuitFieldState,
  (s: CircuitFieldState) => s.selectedPin
);
