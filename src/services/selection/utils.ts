import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createSelectionReducer = createServiceReducerCreator("selection");
export const createSelectionSelector = createServiceSelectorCreator(
  "selection"
);
