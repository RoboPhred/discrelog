import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createUiLayoutReducer = createServiceReducerCreator("uiLayout");
export const createUiLayoutSelector = createServiceSelectorCreator("uiLayout");
