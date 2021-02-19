import { AppState } from "@/store";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorUiSelector } from "../utils";

export const editingCircuitIdSelector = createCircuitEditorUiSelector(
  (state) => state.editingCircuitId
);

export const editingCircuitNameSelector = (state: AppState) =>
  circuitNameFromIdSelector(state, editingCircuitIdSelector(state));
