import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createProjectReducer = createServiceReducerCreator("project");
export const createProjectSelector = createServiceSelectorCreator("project");
