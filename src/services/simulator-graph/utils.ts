import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createSimulatorGraphReducer = createServiceReducerCreator(
  "simulatorGraph"
);
export const createSimulatorGraphSelector = createServiceSelectorCreator(
  "simulatorGraph"
);
