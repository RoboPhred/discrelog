import { createCircuitEditorUiSelector } from "../utils";

export const viewScaleSelector = createCircuitEditorUiSelector(
  (s) => s.viewScale
);
