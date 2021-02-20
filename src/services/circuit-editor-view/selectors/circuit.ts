import { AppState } from "@/store";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorViewSelector } from "../utils";

export const editingCircuitIdSelector = createCircuitEditorViewSelector(
  (state) => state.editingCircuitId
);

export const editingCircuitNodeIdPathSelector = createCircuitEditorViewSelector(
  (state) => state.editingCircuitNodeIdPath ?? []
);

export const editingCircuitNameSelector = (state: AppState) =>
  circuitNameFromIdSelector(state, editingCircuitIdSelector(state));
