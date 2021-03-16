import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorsReducer = createServiceReducerCreator(
  "circuitEditors"
);
export const createCircuitEditorsSelector = createServiceSelectorCreator(
  "circuitEditors"
);
