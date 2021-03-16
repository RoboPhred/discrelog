import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorDragReducer = createServiceReducerCreator(
  "circuitEditorDrag"
);
export const createCircuitEditorDragSelector = createServiceSelectorCreator(
  "circuitEditorDrag"
);
