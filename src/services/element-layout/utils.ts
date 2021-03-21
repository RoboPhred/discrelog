import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createElementLayoutReducer = createServiceReducerCreator(
  "elementLayout"
);
export const createElementLayoutSelector = createServiceSelectorCreator(
  "elementLayout"
);
