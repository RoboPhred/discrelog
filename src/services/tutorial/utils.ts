import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createTutorialReducer = createServiceReducerCreator("tutorial");
export const createTutorialSelector = createServiceSelectorCreator("tutorial");
