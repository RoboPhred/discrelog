import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createNodeLayoutReducer = createServiceReducerCreator(
  "nodeLayout"
);
export const createNodeLayoutSelector = createServiceSelectorCreator(
  "nodeLayout"
);
