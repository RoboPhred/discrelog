import { AppState } from "@/store";
import { immutableEmptyArray } from "@/arrays";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorUiViewportSelector } from "../utils";

export const editingCircuitIdSelector = createCircuitEditorUiViewportSelector(
  (state) => state.editingCircuitId
);

export const editingCircuitNodeIdPathSelector = createCircuitEditorUiViewportSelector(
  (state) => state.editingCircuitNodeIdPath ?? immutableEmptyArray<string>()
);

export const editingCircuitNameSelector = (state: AppState) =>
  circuitNameFromIdSelector(state, editingCircuitIdSelector(state));
