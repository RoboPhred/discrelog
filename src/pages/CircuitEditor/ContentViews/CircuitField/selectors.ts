import { createSelector } from "reselect";

import { AppState } from "@/store";
import { normalizeRectangle } from "@/geometry";

import { CircuitFieldState } from "./state";

export const circuitFieldState = (state: AppState) =>
  state.ui.circuitEditor.circuitField;

export const selectionRect = createSelector(
  circuitFieldState,
  (s: CircuitFieldState) =>
    s.dragMode === "select" && s.dragStart && s.dragEnd
      ? normalizeRectangle(s.dragStart, s.dragEnd)
      : null
);
