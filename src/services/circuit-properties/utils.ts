import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitPropertiesReducer = createServiceReducerCreator(
  "circuitProperties"
);
export const createCircuitPropertiesSelector = createServiceSelectorCreator(
  "circuitProperties"
);
