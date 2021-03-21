import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createElementGraphReducer = createServiceReducerCreator(
  "elementGraph"
);
export const createElementGraphSelector = createServiceSelectorCreator(
  "elementGraph"
);
