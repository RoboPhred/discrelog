import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorUiViewportReducer = createServiceReducerCreator(
  "circuitEditorUiViewport"
);
export const createCircuitEditorUiViewportSelector = createServiceSelectorCreator(
  "circuitEditorUiViewport"
);
