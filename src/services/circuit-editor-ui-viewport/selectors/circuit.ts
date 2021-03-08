import { immutableEmptyArray } from "@/arrays";

import { createCircuitEditorUiViewportSelector } from "../utils";

export const editingCircuitIdSelector = createCircuitEditorUiViewportSelector(
  (state) => state.editingCircuitId
);

export const editingCircuitNodeIdPathSelector = createCircuitEditorUiViewportSelector(
  (state) => state.editingCircuitNodeIdPath ?? immutableEmptyArray<string>()
);
