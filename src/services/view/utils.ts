import {
  createServiceReducerCreator,
  createServiceSelectorCreator
} from "../service-state-utils";

export const createViewReducer = createServiceReducerCreator("view");
export const createViewSelector = createServiceSelectorCreator("view");
