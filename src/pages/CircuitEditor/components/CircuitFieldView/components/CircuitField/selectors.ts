import { createSelector } from "reselect";

import { AppState } from "@/store";

import { CircuitFieldState } from "./state";

export const circuitFieldState = (state: AppState) =>
  state.ui.circuitEditor.circuitField;

export const selectedPinSelector = createSelector(
  circuitFieldState,
  (s: CircuitFieldState) => s.selectedPin
);
