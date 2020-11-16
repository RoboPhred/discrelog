import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorUiReducer = createServiceReducerCreator(
  "circuitEditorUi"
);
export const createCircuitEditorUiSelector = createServiceSelectorCreator(
  "circuitEditorUi"
);
