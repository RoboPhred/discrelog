import {
  createServiceReducerCreator,
  createServiceSelectorCreator
} from "../service-state-utils";

export const createFieldReducer = createServiceReducerCreator("field");
export const createFieldSelector = createServiceSelectorCreator("field");
