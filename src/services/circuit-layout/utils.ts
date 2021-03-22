import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitLayoutReducer = createServiceReducerCreator(
  "circuitLayout"
);
export const createCircuitLayoutSelector = createServiceSelectorCreator(
  "circuitLayout"
);
