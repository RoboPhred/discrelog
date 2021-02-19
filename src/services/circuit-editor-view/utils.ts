import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorViewReducer = createServiceReducerCreator(
  "circuitEditorView"
);
export const createCircuitEditorViewSelector = createServiceSelectorCreator(
  "circuitEditorView"
);
