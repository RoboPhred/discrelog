import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createDialogReducer = createServiceReducerCreator("dialog");
export const createDialogSelector = createServiceSelectorCreator("dialog");
