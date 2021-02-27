import { createCircuitEditorUiViewportSelector } from "../utils";

export const viewScaleSelector = createCircuitEditorUiViewportSelector(
  (s) => s.viewScale
);
