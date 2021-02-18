import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createSimulatorControlReducer = createServiceReducerCreator(
  "simulatorControl"
);
export const createSimulatorControlSelector = createServiceSelectorCreator(
  "simulatorControl"
);
