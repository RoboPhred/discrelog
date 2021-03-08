import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createUiSettingsReducer = createServiceReducerCreator(
  "uiSettings"
);
export const createUiSettingsSelector = createServiceSelectorCreator(
  "uiSettings"
);
