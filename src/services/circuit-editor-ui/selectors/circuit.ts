import { createCircuitEditorUiSelector } from "../utils";

export const editingCircuitIdSelector = createCircuitEditorUiSelector(
  (state) => state.editingCircuitId
);
