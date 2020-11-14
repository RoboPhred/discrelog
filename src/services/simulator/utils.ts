import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createSimulatorReducer = createServiceReducerCreator("simulator");
export const createSimulatorSelector = createServiceSelectorCreator(
  "simulator"
);
