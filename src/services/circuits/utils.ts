import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitsReducer = createServiceReducerCreator("circuits");
export const createCircuitsSelector = createServiceSelectorCreator("circuits");
