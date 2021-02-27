import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorUiSettingsReducer = createServiceReducerCreator(
  "circuitEditorUiSettings"
);
export const createCircuitEditorUiSettingsSelector = createServiceSelectorCreator(
  "circuitEditorUiSettings"
);
