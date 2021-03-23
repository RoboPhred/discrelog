import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitGraphReducer = createServiceReducerCreator(
  "circuitGraph"
);
export const createCircuitGraphSelector = createServiceSelectorCreator(
  "circuitGraph"
);
