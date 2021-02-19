import { createCircuitEditorViewSelector } from "../utils";

export const viewScaleSelector = createCircuitEditorViewSelector(
  (s) => s.viewScale
);
